import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../shared/models/calendar_models.dart';
import '../supabase/supabase_client_provider.dart';

abstract class CalendarsRepository {
  Future<List<CalendarSummary>> listOwnedCalendars(String ownerId);
  Future<CalendarDetailModel?> getOwnerCalendarDetail(String calendarId);
  Future<CalendarDetailModel?> getPublicCalendarMetadata(String calendarId);
  Future<List<CalendarDayModel>> getPublicCalendarDays(String calendarId);
  Future<CalendarDetailModel?> getPublicCalendar(String calendarId);
  Future<String> createCalendar({
    required String ownerId,
    required String title,
    required String themeId,
    required int duration,
    required String privacy,
    bool isPremium = false,
  });
  Future<void> updateDay({
    required String calendarId,
    required int day,
    String? contentType,
    String? message,
    String? url,
    String? label,
  });
  Future<bool> verifyCalendarPassword({
    required String calendarId,
    required String password,
  });
  Future<void> updateCalendar({
    required String calendarId,
    String? title,
    String? headerMessage,
    String? footerMessage,
    String? themeId,
    String? privacy,
    String? status,
    String? password,
    bool clearPassword = false,
  });
  Future<void> deleteCalendar(String calendarId);
}

class SupabaseCalendarsRepository implements CalendarsRepository {
  SupabaseCalendarsRepository(this._client);

  final SupabaseClient _client;

  @override
  Future<List<CalendarSummary>> listOwnedCalendars(String ownerId) async {
    final data = await _client
        .from('calendars')
        .select('id,title,theme_id,status,privacy,duration,created_at,is_premium,header_message,footer_message,views')
        .eq('owner_id', ownerId)
        .order('created_at', ascending: false);

    return (data as List)
        .map((e) => CalendarSummary.fromMap(Map<String, dynamic>.from(e)))
        .toList();
  }

  @override
  Future<CalendarDetailModel?> getOwnerCalendarDetail(String calendarId) async {
    final calendar = await _client
        .from('calendars')
        .select(
          'id,title,theme_id,status,privacy,duration,created_at,is_premium,password,header_message,footer_message',
        )
        .eq('id', calendarId)
        .maybeSingle();

    if (calendar == null) return null;

    final days = await _client
        .from('calendar_days')
        .select('id,calendar_id,day,content_type,message,url,label,opened_count')
        .eq('calendar_id', calendarId)
        .order('day');

    final calMap = Map<String, dynamic>.from(calendar);
    final hasPassword = (calMap['password'] as String?)?.isNotEmpty ?? false;

    return CalendarDetailModel(
      calendar: CalendarSummary.fromMap(calMap),
      days: (days as List)
          .map((e) => CalendarDayModel.fromMap(Map<String, dynamic>.from(e)))
          .toList(),
      hasPassword: hasPassword,
    );
  }

  @override
  Future<CalendarDetailModel?> getPublicCalendarMetadata(String calendarId) async {
    final rows = await _client
        .from('calendars')
        .select(
          'id,title,theme_id,status,privacy,duration,created_at,is_premium,password,header_message,footer_message',
        )
        .eq('id', calendarId)
        .limit(1);

    if ((rows as List).isEmpty) return null;

    final calendar = Map<String, dynamic>.from(rows.first as Map);
    final hasPassword = (calendar['password'] as String?)?.isNotEmpty ?? false;

    return CalendarDetailModel(
      calendar: CalendarSummary.fromMap(calendar),
      days: const [],
      hasPassword: hasPassword,
    );
  }

  @override
  Future<List<CalendarDayModel>> getPublicCalendarDays(String calendarId) async {
    final days = await _client
        .from('calendar_days')
        .select('id,calendar_id,day,content_type,message,url,label,opened_count')
        .eq('calendar_id', calendarId)
        .order('day');

    return (days as List)
        .map((e) => CalendarDayModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();
  }

  @override
  Future<CalendarDetailModel?> getPublicCalendar(String calendarId) async {
    final meta = await getPublicCalendarMetadata(calendarId);
    if (meta == null) return null;
    final days = await getPublicCalendarDays(calendarId);
    return CalendarDetailModel(
      calendar: meta.calendar,
      days: days,
      hasPassword: meta.hasPassword,
    );
  }

  @override
  Future<String> createCalendar({
    required String ownerId,
    required String title,
    required String themeId,
    required int duration,
    required String privacy,
    bool isPremium = false,
  }) async {
    final calendar = await _client
        .from('calendars')
        .insert({
          'owner_id': ownerId,
          'title': title,
          'theme_id': themeId,
          'duration': duration,
          'privacy': privacy,
          'status': 'rascunho',
          'is_premium': isPremium,
        })
        .select('id')
        .single();

    final calendarId = (calendar['id'] as String);

    final days = List.generate(
      duration,
      (index) => {
        'calendar_id': calendarId,
        'day': index + 1,
      },
    );

    await _client.from('calendar_days').insert(days);
    return calendarId;
  }

  @override
  Future<void> updateDay({
    required String calendarId,
    required int day,
    String? contentType,
    String? message,
    String? url,
    String? label,
  }) async {
    final payload = <String, dynamic>{
      'content_type': contentType,
      'message': message,
      'url': url,
      'label': label,
      'updated_at': DateTime.now().toUtc().toIso8601String(),
    };

    await _client
        .from('calendar_days')
        .update(payload)
        .eq('calendar_id', calendarId)
        .eq('day', day);
  }

  @override
  Future<bool> verifyCalendarPassword({
    required String calendarId,
    required String password,
  }) async {
    try {
      final result = await _client.rpc(
        'verify_calendar_password',
        params: {
          'p_calendar_id': calendarId,
          'p_password': password,
        },
      );
      if (result is bool) return result;
      if (result is List && result.isNotEmpty) {
        final row = result.first;
        if (row is Map && row['is_valid'] is bool) return row['is_valid'] as bool;
        if (row is bool) return row;
      }
      if (result is Map) {
        if (result['authorized'] is bool) return result['authorized'] as bool;
        if (result['is_valid'] is bool) return result['is_valid'] as bool;
      }
    } catch (_) {
      // Fallback below.
    }
    return false;
  }

  @override
  Future<void> updateCalendar({
    required String calendarId,
    String? title,
    String? headerMessage,
    String? footerMessage,
    String? themeId,
    String? privacy,
    String? status,
    String? password,
    bool clearPassword = false,
  }) async {
    final payload = <String, dynamic>{
      ...?title?.let((value) => {'title': value}),
      ...?headerMessage?.let((value) => {'header_message': value}),
      ...?footerMessage?.let((value) => {'footer_message': value}),
      ...?themeId?.let((value) => {'theme_id': value}),
      ...?privacy?.let((value) => {'privacy': value}),
      ...?status?.let((value) => {'status': value}),
      if (clearPassword) 'password': null,
      ...?password?.let((value) => {'password': value}),
      'updated_at': DateTime.now().toUtc().toIso8601String(),
    };

    if (payload.length == 1 && payload.containsKey('updated_at')) return;

    await _client.from('calendars').update(payload).eq('id', calendarId);
  }

  @override
  Future<void> deleteCalendar(String calendarId) async {
    // Delete days first (cascade), then the calendar
    await _client.from('calendar_days').delete().eq('calendar_id', calendarId);
    await _client.from('calendars').delete().eq('id', calendarId);
  }
}

extension on String {
  T let<T>(T Function(String value) transform) => transform(this);
}

final calendarsRepositoryProvider = Provider<CalendarsRepository>((ref) {
  return SupabaseCalendarsRepository(ref.watch(supabaseClientProvider));
});
