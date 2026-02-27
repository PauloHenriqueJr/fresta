import 'dart:async';

import 'package:app_links/app_links.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/env/app_env.dart';
import '../../auth/data/auth_repository.dart';
import '../../navigation/navigation_intents.dart';
import '../../../app/router/app_router.dart';

class DeepLinkService {
  DeepLinkService();

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _sub;
  bool _started = false;

  Future<void> start(WidgetRef ref) async {
    if (_started) return;
    _started = true;

    final initialUri = await _appLinks.getInitialLink();
    if (initialUri != null) {
      _handleUri(ref, initialUri);
    }

    _sub = _appLinks.uriLinkStream.listen(
      (uri) => _handleUri(ref, uri),
      onError: (_) {},
    );
  }

  Future<void> _handleUri(WidgetRef ref, Uri uri) async {
    final isAuthCallback = _looksLikeAuthCallback(uri);
    final path = _extractAppPath(uri);
    if (path == null) return;

    if (isAuthCallback) {
      ref.read(appRouterProvider).go('/auth/callback');
      try {
        await ref.read(authRepositoryProvider).handleAuthCallback(uri);
      } catch (_) {
        // UI handles the signed-in transition; auth errors fall back to login callback screen.
      }
      return;
    }

    ref.read(navigationIntentProvider.notifier).setPendingDeepLinkRoute(path);
    ref.read(appRouterProvider).go(path);
  }

  String? _extractAppPath(Uri uri) {
    if (_looksLikeAuthCallback(uri)) return '/auth/callback';

    if (uri.scheme == AppEnv.deepLinkScheme && uri.host == 'c') {
      final id = uri.pathSegments.isNotEmpty ? uri.pathSegments.first : null;
      if (id != null && id.isNotEmpty) return '/c/$id';
    }

    final path = uri.path;
    if (path.startsWith('/c/')) return path;

    final fragment = uri.fragment;
    if (fragment.startsWith('/c/')) return fragment;
    if (fragment.startsWith('c/')) return '/$fragment';

    return null;
  }

  bool _looksLikeAuthCallback(Uri uri) {
    final isCustomAuthCallback = uri.scheme == AppEnv.deepLinkScheme &&
        uri.host == AppEnv.deepLinkAuthHost &&
        uri.path == '/callback';

    final hasAuthParams = uri.queryParameters.containsKey('code') ||
        uri.queryParameters.containsKey('access_token') ||
        uri.fragment.contains('access_token=') ||
        uri.fragment.contains('code=');

    final fragmentPath = uri.fragment.startsWith('/auth/callback');
    final webAuthPath = uri.path == '/auth/callback';

    return (isCustomAuthCallback && hasAuthParams) || fragmentPath || webAuthPath;
  }

  Future<void> stop() async {
    await _sub?.cancel();
    _sub = null;
    _started = false;
  }
}

final deepLinkServiceProvider = Provider<DeepLinkService>((ref) {
  final service = DeepLinkService();
  ref.onDispose(() {
    service.stop();
  });
  return service;
});
