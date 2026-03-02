import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/env/app_env.dart';
import '../../../data/supabase/supabase_client_provider.dart';

abstract class AuthRepository {
  Session? get currentSession;
  Stream<AuthState> authStateChanges();
  Future<void> signInWithMagicLink(String email);
  Future<void> signInWithGoogle();
  Future<void> signInWithApple();
  Future<void> handleAuthCallback(Uri uri);
  Future<void> signOut();
}

class SupabaseAuthRepository implements AuthRepository {
  SupabaseAuthRepository(this._client)
      : _googleSignIn = GoogleSignIn(
          scopes: const ['email', 'profile', 'openid'],
          serverClientId: AppEnv.googleWebClientId.isEmpty ? null : AppEnv.googleWebClientId,
        );

  final SupabaseClient _client;
  final GoogleSignIn _googleSignIn;

  @override
  Session? get currentSession => _client.auth.currentSession;

  @override
  Stream<AuthState> authStateChanges() => _client.auth.onAuthStateChange;

  @override
  Future<void> signInWithMagicLink(String email) async {
    await _client.auth.signInWithOtp(
      email: email,
      emailRedirectTo: AppEnv.authRedirectUrl,
    );
  }

  @override
  Future<void> signInWithGoogle() async {
    if (AppEnv.googleWebClientId.isEmpty) {
      throw StateError(
        'FRESTA_GOOGLE_WEB_CLIENT_ID não definido no .env. Configure o cliente Web do Google para login nativo.',
      );
    }

    try {
      await _googleSignIn.signOut();
    } catch (_) {
      // Ignore; best-effort to reopen account picker.
    }

    final account = await _googleSignIn.signIn();
    if (account == null) {
      throw StateError('Login com Google cancelado.');
    }

    final auth = await account.authentication;
    final idToken = auth.idToken;
    if (idToken == null || idToken.isEmpty) {
      throw StateError(
        'Google não retornou ID token. Verifique o cliente Web (serverClientId) e a configuração OAuth.',
      );
    }

    await _client.auth.signInWithIdToken(
      provider: OAuthProvider.google,
      idToken: idToken,
      accessToken: auth.accessToken,
    );
  }

  @override
  Future<void> signInWithApple() async {
    final rawNonce = _client.auth.generateRawNonce();
    final hashedNonce = sha256.convert(utf8.encode(rawNonce)).toString();

    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
      nonce: hashedNonce,
    );

    final idToken = credential.identityToken;
    if (idToken == null) {
      throw const AuthException(
        'Could not find ID Token from Apple Sign In.',
      );
    }

    await _client.auth.signInWithIdToken(
      provider: OAuthProvider.apple,
      idToken: idToken,
      nonce: rawNonce,
    );
  }

  @override
  Future<void> handleAuthCallback(Uri uri) async {
    await _client.auth.getSessionFromUrl(uri);
  }

  @override
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
    } catch (_) {
      // Ignore provider sign-out failures; Supabase sign-out still matters.
    }
    await _client.auth.signOut();
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return SupabaseAuthRepository(ref.watch(supabaseClientProvider));
});
