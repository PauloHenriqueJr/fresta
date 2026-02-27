import 'package:flutter_riverpod/flutter_riverpod.dart';

class NavigationIntentState {
  const NavigationIntentState({
    this.pendingDeepLinkRoute,
    this.postLoginTargetRoute,
  });

  final String? pendingDeepLinkRoute;
  final String? postLoginTargetRoute;

  NavigationIntentState copyWith({
    String? pendingDeepLinkRoute,
    String? postLoginTargetRoute,
    bool clearPendingDeepLink = false,
    bool clearPostLoginTarget = false,
  }) {
    return NavigationIntentState(
      pendingDeepLinkRoute: clearPendingDeepLink
          ? null
          : (pendingDeepLinkRoute ?? this.pendingDeepLinkRoute),
      postLoginTargetRoute: clearPostLoginTarget
          ? null
          : (postLoginTargetRoute ?? this.postLoginTargetRoute),
    );
  }
}

class NavigationIntentController extends Notifier<NavigationIntentState> {
  @override
  NavigationIntentState build() => const NavigationIntentState();

  void setPendingDeepLinkRoute(String route) {
    state = state.copyWith(pendingDeepLinkRoute: route);
  }

  void setPostLoginTargetRoute(String route) {
    state = state.copyWith(postLoginTargetRoute: route);
  }

  String? consumePendingDeepLinkRoute() {
    final value = state.pendingDeepLinkRoute;
    state = state.copyWith(clearPendingDeepLink: true);
    return value;
  }

  String? consumePostLoginTargetRoute() {
    final value = state.postLoginTargetRoute;
    state = state.copyWith(clearPostLoginTarget: true);
    return value;
  }
}

final navigationIntentProvider =
    NotifierProvider<NavigationIntentController, NavigationIntentState>(
  NavigationIntentController.new,
);
