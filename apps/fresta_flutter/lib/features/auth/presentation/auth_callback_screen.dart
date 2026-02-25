import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/router/post_auth_redirect_resolver.dart';
import '../application/auth_controller.dart';
import '../domain/auth_session_state.dart';

class AuthCallbackScreen extends ConsumerStatefulWidget {
  const AuthCallbackScreen({super.key});

  @override
  ConsumerState<AuthCallbackScreen> createState() => _AuthCallbackScreenState();
}

class _AuthCallbackScreenState extends ConsumerState<AuthCallbackScreen> {
  ProviderSubscription<AuthSessionState>? _authSub;
  bool _redirected = false;

  @override
  void initState() {
    super.initState();

    _authSub = ref.listenManual<AuthSessionState>(authControllerProvider, (previous, next) {
      if (next.isAuthenticated) {
        _redirectToTarget();
      }
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final auth = ref.read(authControllerProvider);
      if (auth.isAuthenticated) {
        _redirectToTarget();
      }
    });
  }

  void _redirectToTarget() {
    if (_redirected || !mounted) return;
    _redirected = true;
    final target = PostAuthRedirectResolver.resolve(ref);
    context.go(target);
  }

  @override
  void dispose() {
    _authSub?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF6F1E8), Color(0xFFEFE6D9)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 360),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: const Color(0xFF164A3C).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: const Center(child: CircularProgressIndicator()),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        auth.isAuthenticated
                            ? 'Login concluído'
                            : 'Autenticando no aplicativo',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        auth.isAuthenticated
                            ? 'Redirecionando para o destino correto...'
                            : 'Processando retorno de autenticação e restaurando sua sessão.',
                        textAlign: TextAlign.center,
                      ),
                      if (!auth.isLoading && !auth.isAuthenticated) ...[
                        const SizedBox(height: 16),
                        FilledButton.tonal(
                          onPressed: () => context.go('/auth/login'),
                          child: const Text('Voltar para login'),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
