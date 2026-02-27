import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../../shared/models/calendar_models.dart';
import '../../auth/application/auth_controller.dart';

final myCalendarsProvider = FutureProvider<List<CalendarSummary>>((ref) async {
  final auth = ref.watch(authControllerProvider);
  final user = auth.user;
  if (user == null) return const [];
  return ref.watch(calendarsRepositoryProvider).listOwnedCalendars(user.id);
});

final ownerCalendarDetailProvider =
    FutureProvider.family<CalendarDetailModel?, String>((ref, calendarId) async {
  return ref.watch(calendarsRepositoryProvider).getOwnerCalendarDetail(calendarId);
});
