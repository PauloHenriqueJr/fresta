import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../data/auth_repository.dart';
import '../domain/auth_session_state.dart';
import '../../profile/data/profile_repository.dart';
import '../../profile/domain/profile_model.dart';

class AuthController extends Notifier<AuthSessionState> implements Listenable {
  StreamSubscription<AuthState>? _authSub;
  final List<VoidCallback> _listeners = [];

  @override
  void addListener(VoidCallback listener) => _listeners.add(listener);

  @override
  void removeListener(VoidCallback listener) => _listeners.remove(listener);

  void _notifyListeners() {
    for (final listener in _listeners) {
      listener();
    }
  }

  @override
  set state(AuthSessionState value) {
    super.state = value;
    _notifyListeners();
  }

  @override
  AuthSessionState build() {
    // We start as loading. The initialization will happen next.
    // Riverpod 3.0/Notifier build should be as synchronous as possible for initial state.
    // However, Supabase auth state needs a small delay to be reliable in some cases.
    
    // Safety check: if we somehow stay in loading too long, force it off.
    Timer(const Duration(seconds: 10), () {
      if (state.isLoading) {
        state = state.copyWith(isLoading: false);
      }
    });

    _authSub?.cancel();
    _initialize();

    ref.onDispose(() {
      _authSub?.cancel();
    });

    return const AuthSessionState(isLoading: true);
  }

  Future<void> _initialize() async {
    final authRepository = ref.read(authRepositoryProvider);
    
    // 1. Give Supabase a tiny moment to ensure session is loaded from storage
    // This helps avoid race conditions where currentSession is null but will be non-null in 50ms.
    await Future.delayed(const Duration(milliseconds: 100));

    final session = authRepository.currentSession;
    if (session != null) {
      _applySession(session);
      // unawaited profile refresh
      unawaited(_refreshProfile(session.user.id));
    } else {
      state = state.copyWith(isLoading: false);
    }

    // 2. Listen for future changes
    _authSub = authRepository.authStateChanges().listen((event) async {
      final newSession = event.session;
      if (newSession == null) {
        state = state.copyWith(isLoading: false, session: null, user: null, clearProfile: true);
        return;
      }
      _applySession(newSession);
      await _refreshProfile(newSession.user.id);
    });
  }

  void _applySession(Session session) {
    if (state.session?.accessToken == session.accessToken && 
        state.user?.id == session.user.id && 
        !state.isLoading) {
      return; // Already in this state
    }
    state = state.copyWith(
      isLoading: false,
      user: session.user,
      session: session,
      // We don't clear profile here if it's the same user to avoid flicker
      clearProfile: state.user?.id != session.user.id,
    );
  }

  Future<void> _refreshProfile(String userId) async {
    try {
      final profileRepository = ref.read(profileRepositoryProvider);
      final profile = await profileRepository
          .getProfile(userId)
          .timeout(const Duration(seconds: 5));
      
      if (state.user?.id == userId) {
        state = state.copyWith(profile: profile, isLoading: false);

        // Sync metadata from Google if profile is incomplete or missing
        final user = state.user;
        if (user != null) {
          final metadata = user.userMetadata;
          final avatarUrl = metadata?['avatar_url'] ?? metadata?['picture'];
          final fullName = metadata?['full_name'] ?? metadata?['name'];

          // If we have no profile yet, we should still use metadata for display
          if (profile == null) {
            final initialProfile = ProfileModel(
              id: userId,
              email: user.email,
              displayName: fullName,
              avatar: avatarUrl ?? '🦊',
              onboardingCompleted: false,
            );
            // We don't await update here to avoid blocking, the trigger will eventually save it
            state = state.copyWith(profile: initialProfile);
            return;
          }

          bool needsUpdate = false;
          String? newAvatar = profile.avatar;
          String? newDisplayName = profile.displayName;

          // If avatar is default ('🦊') or missing, and we have a Google one
          if ((profile.avatar == null || profile.avatar == '🦊' || !profile.avatar!.startsWith('http')) && avatarUrl != null) {
            newAvatar = avatarUrl;
            needsUpdate = true;
          }

          // If display name is missing or empty
          if ((profile.displayName == null || profile.displayName!.isEmpty) && fullName != null) {
            newDisplayName = fullName;
            needsUpdate = true;
          }

          if (needsUpdate) {
            final updatedProfile = ProfileModel(
              id: profile.id,
              email: profile.email,
              displayName: newDisplayName,
              avatar: newAvatar,
              themePreference: profile.themePreference,
              onboardingCompleted: profile.onboardingCompleted,
              role: profile.role,
            );
            await profileRepository.updateProfile(updatedProfile);
            state = state.copyWith(profile: updatedProfile);
          }
        }
      }
    } catch (_) {
      // Safety: always ensure isLoading is false after profile attempt
      if (state.user?.id == userId) {
        state = state.copyWith(isLoading: false);
      }
    }
  }

  Future<void> signInWithMagicLink(String email) async {
    await ref.read(authRepositoryProvider).signInWithMagicLink(email);
  }

  Future<void> signInWithGoogle() async {
    await ref.read(authRepositoryProvider).signInWithGoogle();
  }

  Future<void> signOut() async {
    await ref.read(authRepositoryProvider).signOut();
  }

  Future<void> updateThemePreference(String theme) async {
    final profile = state.profile;
    if (profile == null) return;

    final updatedProfile = profile.copyWith(themePreference: theme);
    await ref.read(profileRepositoryProvider).updateProfile(updatedProfile);
    state = state.copyWith(profile: updatedProfile);
  }

}

final authControllerProvider = NotifierProvider<AuthController, AuthSessionState>(
  AuthController.new,
);
