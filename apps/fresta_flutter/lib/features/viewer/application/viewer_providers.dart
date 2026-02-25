import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/viewer_repository.dart';
import '../../../shared/models/calendar_models.dart';

final sharedCalendarMetadataProvider = FutureProvider.family<CalendarDetailModel?, String>(
  (ref, calendarId) async {
    return ref.watch(viewerRepositoryProvider).getSharedCalendarMetadata(calendarId);
  },
);

final sharedCalendarDaysProvider = FutureProvider.family<List<CalendarDayModel>, String>(
  (ref, calendarId) async {
    return ref.watch(viewerRepositoryProvider).getSharedCalendarDays(calendarId);
  },
);
