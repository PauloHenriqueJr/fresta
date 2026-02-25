import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../data/auth_repository.dart';
import '../domain/auth_session_state.dart';
import '../../profile/data/profile_repository.dart';

class AuthController extends Notifier<AuthSessionState> {
  StreamSubscription<AuthState>? _authSub;
  bool _didInitialize = false;

  @override
  AuthSessionState build() {
    if (!_didInitialize) {
      _didInitialize = true;
      _initialize();
    }
    ref.onDispose(() {
      _authSub?.cancel();
    });
    return const AuthSessionState(isLoading: true);
  }

  Future<void> _initialize() async {
    final authRepository = ref.read(authRepositoryProvider);
    final session = authRepository.currentSession;

    if (session != null) {
      _applySession(session);
      unawaited(_refreshProfile(session.user.id));
    } else {
      state = const AuthSessionState(isLoading: false);
    }

    await _authSub?.cancel();
    _authSub = authRepository.authStateChanges().listen((event) async {
      final newSession = event.session;
      if (newSession == null) {
        state = const AuthSessionState(isLoading: false);
        return;
      }
      _applySession(newSession);
      await _refreshProfile(newSession.user.id);
    });
  }

  void _applySession(Session session) {
    final user = session.user;
    state = state.copyWith(
      isLoading: false,
      user: user,
      session: session,
      clearProfile: true,
    );
  }

  Future<void> _refreshProfile(String userId) async {
    try {
      final profile = await ref
          .read(profileRepositoryProvider)
          .getProfile(userId)
          .timeout(const Duration(seconds: 8));
      state = state.copyWith(profile: profile);
    } catch (_) {
      // Do not block app startup/navigation if profile lookup fails or times out.
      state = state.copyWith(isLoading: false);
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

}

final authControllerProvider = NotifierProvider<AuthController, AuthSessionState>(
  AuthController.new,
);
