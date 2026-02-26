import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/viewer_repository.dart';
import '../../../shared/models/calendar_models.dart';
import '../../auth/application/auth_controller.dart';
import '../../calendars/application/plan_limits_provider.dart';

final sharedCalendarMetadataProvider = FutureProvider.family<CalendarDetailModel?, String>(
  (ref, calendarId) async {
    if (calendarId.startsWith('preview_')) {
      final themeId = calendarId.replaceFirst('preview_', '');
      final meta = CalendarSummary(
        id: calendarId,
        title: 'Exemplo Inspirador',
        themeId: themeId,
        duration: 7,
        privacy: 'public',
        status: 'published',
        isPremium: plusThemes.contains(themeId),
        headerMessage: 'Assim ficará a sua obra de arte!',
        footerMessage: 'Feito com Fresta',
        createdAt: DateTime.now(),
      );
      return CalendarDetailModel(
        calendar: meta,
        days: const [],
        hasPassword: false,
      );
    }
    return ref.watch(viewerRepositoryProvider).getSharedCalendarMetadata(calendarId);
  },
);

final sharedCalendarDaysProvider = FutureProvider.family<List<CalendarDayModel>, String>(
  (ref, calendarId) async {
    if (calendarId.startsWith('preview_')) {
      return List.generate(
        7,
        (i) => CalendarDayModel(
          id: 'mock_$i',
          calendarId: calendarId,
          day: i + 1,
          contentType: i == 0 ? 'text' : (i == 1 ? 'photo' : 'link'),
          message: i == 0 ? 'Mensagem de exemplo no primeiro dia!' : null,
          url: i == 1 ? 'https://picsum.photos/seed/fresta$i/400/400' : 'https://youtube.com',
          label: i == 2 ? 'Assistir vídeo surpresa' : null,
          openedCount: i == 0 ? 1 : 0,
        ),
      );
    }
    return ref.watch(viewerRepositoryProvider).getSharedCalendarDays(calendarId);
  },
);

final isLikedProvider = FutureProvider.family<bool, String>(
  (ref, calendarId) async {
    final auth = ref.watch(authControllerProvider);
    final userId = auth.user?.id;
    if (userId == null) return false;
    return ref.watch(viewerRepositoryProvider).isLikedByUser(calendarId, userId);
  },
);
