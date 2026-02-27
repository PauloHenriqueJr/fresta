import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/models/calendar_models.dart';
import 'calendars_repository.dart';

abstract class ViewerRepository {
  Future<CalendarDetailModel?> getSharedCalendarMetadata(String calendarId);
  Future<List<CalendarDayModel>> getSharedCalendarDays(String calendarId);
  Future<CalendarDetailModel?> getSharedCalendar(String calendarId);
  Future<bool> verifyPassword(String calendarId, String password);
  Future<bool> toggleLike(String calendarId, String userId);
  Future<bool> isLikedByUser(String calendarId, String userId);
}

class DefaultViewerRepository implements ViewerRepository {
  DefaultViewerRepository(this._calendarsRepository);

  final CalendarsRepository _calendarsRepository;

  @override
  Future<CalendarDetailModel?> getSharedCalendarMetadata(String calendarId) =>
      _calendarsRepository.getPublicCalendarMetadata(calendarId);

  @override
  Future<List<CalendarDayModel>> getSharedCalendarDays(String calendarId) =>
      _calendarsRepository.getPublicCalendarDays(calendarId);

  @override
  Future<CalendarDetailModel?> getSharedCalendar(String calendarId) =>
      _calendarsRepository.getPublicCalendar(calendarId);

  @override
  Future<bool> verifyPassword(String calendarId, String password) {
    return _calendarsRepository.verifyCalendarPassword(
      calendarId: calendarId,
      password: password,
    );
  }

  @override
  Future<bool> toggleLike(String calendarId, String userId) =>
      _calendarsRepository.toggleLike(calendarId: calendarId, userId: userId);

  @override
  Future<bool> isLikedByUser(String calendarId, String userId) =>
      _calendarsRepository.isLikedByUser(calendarId: calendarId, userId: userId);
}

final viewerRepositoryProvider = Provider<ViewerRepository>((ref) {
  return DefaultViewerRepository(ref.watch(calendarsRepositoryProvider));
});
