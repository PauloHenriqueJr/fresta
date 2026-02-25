import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/application/auth_controller.dart';
import '../../features/navigation/navigation_intents.dart';
import '../../features/auth/presentation/auth_callback_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/viewer/presentation/viewer_welcome_screen.dart';
import '../../features/viewer/presentation/shared_calendar_viewer_screen.dart';
import '../../features/calendars/presentation/create_calendar_screen.dart';
import '../../features/calendars/presentation/creator_home_screen.dart';
import '../../features/calendars/presentation/calendar_detail_screen.dart';
import '../../features/calendars/presentation/edit_calendar_screen.dart';
import '../../features/calendars/presentation/edit_day_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/profile/presentation/account_settings_screen.dart';
import '../../features/navigation/presentation/app_entry_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authControllerProvider);

  final router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final location = state.uri.path;
      final isViewerRoute = location.startsWith('/c/') ||
          location == '/viewer/welcome' ||
          location == '/';
      final isAuthRoute = location.startsWith('/auth/');
      final requiresAuth = location.startsWith('/creator/') ||
          location.startsWith('/account/');

      if (location.startsWith('/c/')) {
        ref
            .read(navigationIntentProvider.notifier)
            .setPendingDeepLinkRoute(location);
      }

      if (isViewerRoute || isAuthRoute) return null;

      if (requiresAuth && !authState.isAuthenticated) {
        ref
            .read(navigationIntentProvider.notifier)
            .setPostLoginTargetRoute(location);
        return '/auth/login';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const AppEntryScreen(),
      ),
      GoRoute(
        path: '/viewer/welcome',
        builder: (context, state) => const ViewerWelcomeScreen(),
      ),
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/callback',
        builder: (context, state) => const AuthCallbackScreen(),
      ),
      GoRoute(
        path: '/c/:calendarId',
        builder: (context, state) => SharedCalendarViewerScreen(
          calendarId: state.pathParameters['calendarId']!,
        ),
      ),
      GoRoute(
        path: '/creator/home',
        builder: (context, state) => const CreatorHomeScreen(),
      ),
      GoRoute(
        path: '/creator/calendars/new',
        builder: (context, state) => const CreateCalendarScreen(),
      ),
      GoRoute(
        path: '/creator/calendars/:id',
        builder: (context, state) => CalendarDetailScreen(
          calendarId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/creator/calendars/:id/edit',
        builder: (context, state) => EditCalendarScreen(
          calendarId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/creator/calendars/:id/day/:day',
        builder: (context, state) => EditDayScreen(
          calendarId: state.pathParameters['id']!,
          day: int.tryParse(state.pathParameters['day'] ?? '') ?? 1,
        ),
      ),
      GoRoute(
        path: '/account/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/account/settings',
        builder: (context, state) => const AccountSettingsScreen(),
      ),
    ],
  );

  ref.onDispose(router.dispose);
  return router;
});
