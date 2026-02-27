import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/supabase/supabase_client_provider.dart';

/// Tracks which calendar days the user has opened.
/// Uses SharedPreferences for local tracking + Supabase RPCs for server-side stats.
class OpenedDaysService {
  OpenedDaysService(this._client);
  final SupabaseClient _client;

  static const _keyPrefix = 'fresta_opened_days_';

  // ── Local Tracking ──

  /// Get the set of opened day numbers for a calendar.
  Future<Set<int>> getOpenedDays(String calendarId) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('$_keyPrefix$calendarId');
    if (raw == null || raw.isEmpty) return {};
    final list = (jsonDecode(raw) as List).cast<int>();
    return list.toSet();
  }

  /// Mark a day as opened locally and call the Supabase RPC.
  Future<void> markDayOpened({
    required String calendarId,
    required int dayNumber,
    String? dayId,
  }) async {
    // Local
    final prefs = await SharedPreferences.getInstance();
    final opened = await getOpenedDays(calendarId);
    if (opened.contains(dayNumber)) return; // Already opened

    opened.add(dayNumber);
    await prefs.setString(
      '$_keyPrefix$calendarId',
      jsonEncode(opened.toList()),
    );

    // Server-side: increment opened count
    if (dayId != null) {
      try {
        await _client.rpc('increment_day_opened', params: {'_day_id': dayId});
      } catch (_) {
        // Non-critical — ignore failures
      }
    }
  }

  /// Check if a specific day is already opened.
  Future<bool> isDayOpened(String calendarId, int dayNumber) async {
    final opened = await getOpenedDays(calendarId);
    return opened.contains(dayNumber);
  }

  /// Count of opened days for a calendar.
  Future<int> openedCount(String calendarId) async {
    final opened = await getOpenedDays(calendarId);
    return opened.length;
  }

  // ── Server-side Stats ──

  /// Increment calendar views (call once when viewer loads).
  Future<void> incrementViews(String calendarId) async {
    try {
      await _client.rpc('increment_calendar_views', params: {'_calendar_id': calendarId});
    } catch (_) {}
  }

  /// Increment calendar shares (call when user shares).
  Future<void> incrementShares(String calendarId) async {
    try {
      await _client.rpc('increment_calendar_shares', params: {'_calendar_id': calendarId});
    } catch (_) {}
  }
}

final openedDaysServiceProvider = Provider<OpenedDaysService>((ref) {
  return OpenedDaysService(ref.watch(supabaseClientProvider));
});
