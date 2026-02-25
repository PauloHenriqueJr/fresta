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
  ProviderSubscription<AuthSessionState>? _authSub;
  bool _isSubmitting = false;
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
    super.dispose();
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

  Future<void> _signInWithApple() async {
    setState(() {
      _isSubmitting = true;
      _error = null;
    });
    try {
      // Implement Apple sign-in in the controller when required.
      // For now, we simulate the structure or call an existing method.
      // await ref.read(authControllerProvider.notifier).signInWithApple();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login com Apple em breve.')),
      );
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
      backgroundColor: const Color(0xFFF8F9F5), // Light background
      body: SafeArea(
        child: Column(
          children: [
            // Close button overlay
            Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: IconButton(
                  icon: const Icon(Icons.close_rounded, color: Color(0xFF1B4D3E)), // Dark icon
                  onPressed: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/');
                    }
                  },
                ),
              ),
            ),
            
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                children: [
                  // Logo
                  Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.door_sliding_rounded,
                          color: Color(0xFFF9A03F), // Accent Gold
                          size: 32,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Fresta',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: const Color(0xFF1B4D3E), // Primary Green
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),

                  // Hero Section: Golden Door opening
                  AspectRatio(
                    aspectRatio: 4 / 5,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(32),
                        gradient: const LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Color(0xFF2D7A5F), // Lighter green at top
                            Color(0xFF13362B), // Dark green at bottom
                          ],
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x331B4D3E),
                            blurRadius: 24,
                            offset: Offset(0, 12),
                          ),
                        ],
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Golden glow
                          Container(
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Color(0xCC1B4D3E),
                                  Color(0x4DF9A03F),
                                ],
                              ),
                            ),
                          ),
                          // Stylized Door Frame
                          Align(
                            alignment: Alignment.bottomCenter,
                            child: Container(
                              width: 200,
                              height: 250,
                              margin: const EdgeInsets.only(bottom: 48),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 2),
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(100),
                                  topRight: Radius.circular(100),
                                ),
                              ),
                              child: Stack(
                                alignment: Alignment.bottomCenter,
                                children: [
                                  // glowing crack
                                  Container(
                                    width: 4,
                                    height: 180,
                                    margin: const EdgeInsets.only(bottom: 24),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF9A03F),
                                      borderRadius: BorderRadius.circular(4),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFFF9A03F).withValues(alpha: 0.8),
                                          blurRadius: 20,
                                          spreadRadius: 4,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Typography Section
                  Text(
                    'A antecipação é\na melhor parte.',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: const Color(0xFF111827),
                      fontWeight: FontWeight.w800,
                      height: 1.1,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Crie contagens regressivas inesquecíveis para momentos especiais.',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: const Color(0xFF5A7470),
                      height: 1.4,
                    ),
                  ),

                  const SizedBox(height: 48),

                  // Auth States & Buttons
                  if (widget.fromAuthCallback) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E0),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.verified_user_rounded, color: Color(0xFF2D7A5F), size: 24),
                          SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Confirmando sua entrada e preparando sua conta...',
                              style: TextStyle(color: Color(0xFF1B4D3E), fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFE5EC),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 24),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _error!,
                              style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Google Button
                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _signInWithGoogle,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF111827),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(999),
                        side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.g_mobiledata_rounded, size: 28),
                        SizedBox(width: 12),
                        Text(
                          'Continuar com o Google',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Apple Button
                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _signInWithApple,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1B4D3E), // Primary green
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.apple_rounded, size: 24),
                        SizedBox(width: 12),
                        Text(
                          'Continuar com a Apple',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Footer Text
                  Text(
                    'Ao continuar, você aceita nossos Termos de Serviço e Privacidade.',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: const Color(0xFF9CA3AF),
                      height: 1.5,
                    ),
                  ),
                  
                  const SizedBox(height: 48), // Padding bottom
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

