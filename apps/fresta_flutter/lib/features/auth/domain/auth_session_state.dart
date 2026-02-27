import 'package:supabase_flutter/supabase_flutter.dart';

import '../../profile/domain/profile_model.dart';

class AuthSessionState {
  const AuthSessionState({
    required this.isLoading,
    this.user,
    this.session,
    this.profile,
    this.pendingDeepLink,
  });

  final bool isLoading;
  final User? user;
  final Session? session;
  final ProfileModel? profile;
  final String? pendingDeepLink;

  bool get isAuthenticated => user != null && session != null;

  AuthSessionState copyWith({
    bool? isLoading,
    User? user,
    Session? session,
    ProfileModel? profile,
    bool clearProfile = false,
    String? pendingDeepLink,
  }) {
    return AuthSessionState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      session: session ?? this.session,
      profile: clearProfile ? null : (profile ?? this.profile),
      pendingDeepLink: pendingDeepLink ?? this.pendingDeepLink,
    );
  }
}
