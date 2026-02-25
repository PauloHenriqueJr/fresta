import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/navigation/navigation_intents.dart';

class PostAuthRedirectResolver {
  static String resolve(WidgetRef ref) {
    final controller = ref.read(navigationIntentProvider.notifier);
    final deepLink = controller.consumePendingDeepLinkRoute();
    if (deepLink != null && deepLink.isNotEmpty) return deepLink;

    final postLogin = controller.consumePostLoginTargetRoute();
    if (postLogin != null && postLogin.isNotEmpty) return postLogin;

    return '/creator/home';
  }
}
