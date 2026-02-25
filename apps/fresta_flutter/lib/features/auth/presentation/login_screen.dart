import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/router/post_auth_redirect_resolver.dart';
import '../application/auth_controller.dart';
import '../domain/auth_session_state.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key, this.fromAuthCallback = false});

  final bool fromAuthCallback;

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  ProviderSubscription<AuthSessionState>? _authSub;
  bool _isSubmitting = false;
  String? _message;
  String? _error;

  @override
  void initState() {
    super.initState();
    _authSub = ref.listenManual<AuthSessionState>(authControllerProvider, (previous, next) {
      if ((previous?.isAuthenticated ?? false) == false && next.isAuthenticated) {
        final target = PostAuthRedirectResolver.resolve(ref);
        if (mounted) context.go(target);
      }
    });
  }

  @override
  void dispose() {
    _authSub?.close();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendMagicLink() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      setState(() => _error = 'Informe um e-mail válido.');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
      _message = null;
    });

    try {
      await ref.read(authControllerProvider.notifier).signInWithMagicLink(email);
      if (!mounted) return;
      setState(() {
        _message = 'Link mágico enviado. Verifique seu e-mail.';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() {
      _isSubmitting = true;
      _error = null;
    });
    try {
      await ref.read(authControllerProvider.notifier).signInWithGoogle();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(-0.75, -0.95),
            radius: 1.4,
            colors: [Color(0xFFF1E6D3), Color(0xFFF6F1E8), Color(0xFFEDE4D5)],
          ),
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: () => context.pop(),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'Entrar',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBF5),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF0E6D8)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Crie e compartilhe\nseu calendário no app',
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Visualizar por link continua sem login. Entre para criar calendários, editar dias e sincronizar sua experiência.',
                    ),
                    if (widget.fromAuthCallback) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF164A3C).withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.verified_user_outlined, size: 18),
                            SizedBox(width: 8),
                            Expanded(child: Text('Confirmando sua entrada e preparando sua conta...')),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Entrar com Google',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Use sua conta Google para acessar seus calendários com rapidez.',
                      ),
                      const SizedBox(height: 12),
                      FilledButton.icon(
                        onPressed: _isSubmitting ? null : _signInWithGoogle,
                        icon: const Icon(Icons.login_rounded),
                        label: const Text('Entrar com Google'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Link mágico por e-mail',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'E-mail',
                          hintText: 'voce@exemplo.com',
                          prefixIcon: Icon(Icons.alternate_email_rounded),
                        ),
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton.icon(
                        onPressed: _isSubmitting ? null : _sendMagicLink,
                        icon: const Icon(Icons.mark_email_read_outlined),
                        label: const Text('Enviar link mágico'),
                      ),
                    ],
                  ),
                ),
              ),
              if (_message != null) ...[
                const SizedBox(height: 12),
                _FeedbackBanner(
                  text: _message!,
                  background: const Color(0xFFE6F5EC),
                  foreground: const Color(0xFF0E6C43),
                  icon: Icons.check_circle_outline_rounded,
                ),
              ],
              if (_error != null) ...[
                const SizedBox(height: 12),
                _FeedbackBanner(
                  text: _error!,
                  background: const Color(0xFFFFECEA),
                  foreground: const Color(0xFFB33B2E),
                  icon: Icons.error_outline_rounded,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _FeedbackBanner extends StatelessWidget {
  const _FeedbackBanner({
    required this.text,
    required this.background,
    required this.foreground,
    required this.icon,
  });

  final String text;
  final Color background;
  final Color foreground;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(icon, color: foreground, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: TextStyle(color: foreground, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
