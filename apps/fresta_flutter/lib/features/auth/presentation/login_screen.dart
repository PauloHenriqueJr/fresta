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
    final size = MediaQuery.of(context).size;
    final isShortScreen = size.height < 700;
    
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              physics: const ClampingScrollPhysics(),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Close button (top left relative to column)
                    Align(
                      alignment: Alignment.centerLeft,
                      child: IconButton(
                        icon: const Icon(Icons.close_rounded, color: Color(0xFF1B4D3E)),
                        onPressed: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/');
                          }
                        },
                      ),
                    ),
                    
                    const SizedBox(height: 8),

                    // Logo
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.door_sliding_rounded,
                          color: Color(0xFFF9A03F),
                          size: 28,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'FRESTA',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: const Color(0xFF1B4D3E),
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ],
                    ),
                    
                    SizedBox(height: isShortScreen ? 20 : 32),

                    // Hero Section: Golden Door opening (Fixed size or responsive)
                    ConstrainedBox(
                      constraints: BoxConstraints(
                        maxHeight: size.height * 0.35,
                        maxWidth: size.height * 0.35 * (4/5),
                      ),
                      child: AspectRatio(
                        aspectRatio: 4 / 5,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(32),
                            gradient: const LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Color(0xFF2D7A5F),
                                Color(0xFF13362B),
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
                              Align(
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  width: 140,
                                  height: 180,
                                  margin: const EdgeInsets.only(bottom: 32),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 2),
                                    borderRadius: const BorderRadius.only(
                                      topLeft: Radius.circular(70),
                                      topRight: Radius.circular(70),
                                    ),
                                  ),
                                  child: Stack(
                                    alignment: Alignment.bottomCenter,
                                    children: [
                                      Container(
                                        width: 3,
                                        height: 130,
                                        margin: const EdgeInsets.only(bottom: 20),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF9A03F),
                                          borderRadius: BorderRadius.circular(4),
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color(0xFFF9A03F).withValues(alpha: 0.8),
                                              blurRadius: 16,
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
                    ),

                    SizedBox(height: isShortScreen ? 24 : 40),

                    // Typography Section
                    Text(
                      'A antecipação é\na melhor parte.',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.headlineMedium?.copyWith(
                        color: const Color(0xFF111827),
                        fontWeight: FontWeight.w800,
                        height: 1.1,
                        fontSize: isShortScreen ? 24 : 32,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Crie contagens regressivas inesquecíveis.',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: const Color(0xFF5A7470),
                        fontSize: 15,
                        height: 1.4,
                      ),
                    ),

                    SizedBox(height: isShortScreen ? 24 : 40),

                    // Auth States
                    if (widget.fromAuthCallback) ...[
                      _LoginStatusCard(
                        icon: Icons.verified_user_rounded,
                        color: const Color(0xFF2D7A5F),
                        bgcolor: const Color(0xFFE8F5E0),
                        message: 'Confirmando sua entrada...',
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (_error != null) ...[
                      _LoginStatusCard(
                        icon: Icons.error_outline_rounded,
                        color: const Color(0xFFEF4444),
                        bgcolor: const Color(0xFFFFE5EC),
                        message: _error!,
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Google Button
                    ElevatedButton(
                      onPressed: _isSubmitting ? null : _signInWithGoogle,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF111827),
                        elevation: 0,
                        minimumSize: const Size.fromHeight(56),
                        padding: const EdgeInsets.symmetric(vertical: 0),
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
                    const SizedBox(height: 12),

                    // Apple Button
                    ElevatedButton(
                      onPressed: _isSubmitting ? null : _signInWithApple,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1B4D3E),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        minimumSize: const Size.fromHeight(56),
                        padding: const EdgeInsets.symmetric(vertical: 0),
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

                    const SizedBox(height: 24),

                    // Footer Text
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Ao continuar, você aceita nossos Termos de Serviço e Privacidade.',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: const Color(0xFF9CA3AF),
                          fontSize: 11,
                          height: 1.4,
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _LoginStatusCard extends StatelessWidget {
  const _LoginStatusCard({
    required this.icon,
    required this.color,
    required this.bgcolor,
    required this.message,
  });

  final IconData icon;
  final Color color;
  final Color bgcolor;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: bgcolor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
