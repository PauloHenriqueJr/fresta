import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../features/viewer/application/deep_link_service.dart';
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
    });
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(appRouterProvider);
    return MaterialApp.router(
      title: 'Fresta',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: router,
    );
  }
}
