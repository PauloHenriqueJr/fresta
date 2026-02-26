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
import '../../features/calendars/presentation/my_calendars_screen.dart';
import '../../features/calendars/presentation/calendar_detail_screen.dart';
import '../../features/calendars/presentation/edit_calendar_screen.dart';
import '../../features/calendars/presentation/edit_day_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/profile/presentation/account_settings_screen.dart';
import '../../features/profile/presentation/notifications_settings_screen.dart';
import '../../features/profile/presentation/help_support_screen.dart';
import '../../features/navigation/presentation/app_entry_screen.dart';
import '../../features/navigation/presentation/main_navigation_scaffold.dart';
import '../../features/calendars/presentation/themes_selection_screen.dart';
import '../../features/explore/presentation/explore_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  // Use a listenable to trigger redirects without re-creating the whole router
  final authNotifier = ref.watch(authControllerProvider.notifier);
  
  return GoRouter(
    initialLocation: '/',
    refreshListenable: authNotifier,
    redirect: (context, state) {
      final authState = ref.read(authControllerProvider);
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

      // If we are still loading the initial auth state, don't redirect yet
      if (authState.isLoading && location == '/') {
        return null;
      }

      if (isViewerRoute || isAuthRoute) {
        if (authState.isAuthenticated) {
          // If authenticated and on a public/auth route, go to home
          // Except if specifically viewing a shared calendar
          if (!location.startsWith('/c/')) {
            return '/creator/home';
          }
        }
        return null;
      }

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
      // Main Navigation Shell
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainNavigationScaffold(navigationShell: navigationShell);
        },
        branches: [
          // Branch 0: Início (Home)
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/creator/home',
                builder: (context, state) => const CreatorHomeScreen(),
                routes: [
                  GoRoute(
                    path: 'themes',
                    builder: (context, state) => const ThemesSelectionScreen(),
                  ),
                ],
              ),
            ],
          ),
          // Branch 1: Calendários
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/creator/calendars',
                builder: (context, state) => const MyCalendarsScreen(),
                routes: [
                  GoRoute(
                    path: 'new',
                    builder: (context, state) => const CreateCalendarScreen(),
                  ),
                  GoRoute(
                    path: ':id',
                    builder: (context, state) => CalendarDetailScreen(
                      calendarId: state.pathParameters['id']!,
                    ),
                    routes: [
                      GoRoute(
                        path: 'edit',
                        builder: (context, state) => EditCalendarScreen(
                          calendarId: state.pathParameters['id']!,
                        ),
                      ),
                      GoRoute(
                        path: 'preview',
                        builder: (context, state) => SharedCalendarViewerScreen(
                          calendarId: state.pathParameters['id']!,
                          isPreview: true,
                        ),
                      ),
                      GoRoute(
                        path: 'day/:day',
                        builder: (context, state) => EditDayScreen(
                          calendarId: state.pathParameters['id']!,
                          day: int.tryParse(state.pathParameters['day'] ?? '') ?? 1,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          // Center Button ("+ Criar") is handled in MainNavigationScaffold._onTap
          
          // Branch 2: Explorar
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/explore',
                builder: (context, state) => const ExploreScreen(),
              ),
            ],
          ),
          // Branch 3: Perfil
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/account/profile',
                builder: (context, state) => const ProfileScreen(),
                routes: [
                  GoRoute(
                    path: 'settings',
                    builder: (context, state) => const AccountSettingsScreen(),
                  ),
                  GoRoute(
                    path: 'notifications',
                    builder: (context, state) => const NotificationsSettingsScreen(),
                  ),
                  GoRoute(
                    path: 'help',
                    builder: (context, state) => const HelpSupportScreen(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
