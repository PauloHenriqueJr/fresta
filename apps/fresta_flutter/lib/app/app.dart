import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/services/notification_service.dart';
import '../features/auth/application/auth_controller.dart';
import '../features/viewer/application/deep_link_service.dart';
import '../features/paywall/application/purchases_service.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

class FrestaApp extends ConsumerStatefulWidget {
  const FrestaApp({super.key});

  @override
  ConsumerState<FrestaApp> createState() => _FrestaAppState();
}

class _FrestaAppState extends ConsumerState<FrestaApp> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(deepLinkServiceProvider).start(ref);
      ref.read(purchasesServiceProvider).init();

      // Wire notification tap → GoRouter navigation
      final router = ref.read(appRouterProvider);
      final notifService = ref.read(notificationServiceProvider);
      notifService.onNotificationTap = (route) {
        router.go(route);
      };

      // Request notification permission on first launch
      notifService.requestPermission();
    });
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(appRouterProvider);
    final auth = ref.watch(authControllerProvider);
    
    // Determine theme mode from profile preference
    ThemeMode themeMode = ThemeMode.dark;
    final pref = auth.profile?.themePreference?.toLowerCase();
    if (pref == 'light') {
      themeMode = ThemeMode.light;
    }

    return MaterialApp.router(
      title: 'Fresta',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: themeMode,
      routerConfig: router,
    );
  }
}
