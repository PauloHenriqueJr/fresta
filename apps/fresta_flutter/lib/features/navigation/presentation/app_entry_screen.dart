import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class AppEntryScreen extends ConsumerStatefulWidget {
  const AppEntryScreen({super.key});

  @override
  ConsumerState<AppEntryScreen> createState() => _AppEntryScreenState();
}

class _AppEntryScreenState extends ConsumerState<AppEntryScreen> {
  final _linkController = TextEditingController();
  String? _error;

  @override
  void initState() {
    super.initState();
    // Auto-redirect if already authenticated
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = ref.read(authControllerProvider);
      if (auth.isAuthenticated) {
        context.go('/creator/home');
      }
    });
  }

  @override
  void dispose() {
    _linkController.dispose();
    super.dispose();
  }

  void _openLink() {
    final value = _linkController.text.trim();
    if (value.isEmpty) {
      setState(() => _error = 'Por favor, insira o link ou ID.');
      return;
    }

    Uri? uri = Uri.tryParse(value);
    if (uri == null) {
      if (_looksLikeCalendarId(value)) {
        context.go('/c/$value');
        return;
      }
      setState(() => _error = 'Link inválido. Ex: fresta.app/c/<id>');
      return;
    }

    String? id;
    if (uri.pathSegments.length >= 2 && uri.pathSegments.first == 'c') {
      id = uri.pathSegments[1];
    } else if (value.startsWith('/c/')) {
      id = value.substring(3);
    } else if (_looksLikeCalendarId(value)) {
      id = value;
    }

    if (id != null && id.isNotEmpty && mounted) {
      setState(() => _error = null);
      context.go('/c/$id');
      return;
    }

    setState(() => _error = 'ID do calendário não encontrado no link.');
  }

  bool _looksLikeCalendarId(String value) {
    final v = value.trim();
    if (v.isEmpty) return false;
    if (v.contains(' ')) return false;
    if (v.contains('/')) return false;
    return v.length >= 8;
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;

    // If suddenly authenticated (e.g. from callback), go to home
    ref.listen(authControllerProvider, (previous, next) {
      if (!(previous?.isAuthenticated ?? false) && next.isAuthenticated) {
        context.go('/creator/home');
      }
    });

    if (auth.isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFF13362B),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF9A03F)),
              ),
              const SizedBox(height: 24),
              Text(
                'Abrindo Fresta...',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF13362B),
      body: Stack(
        children: [
          // Cinematic Background with "Fresta" light effect
          Positioned.fill(
            child: Container(
              color: const Color(0xFF13362B),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 4,
                    height: size.height,
                    decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF9A03F).withValues(alpha: 0.8),
                          blurRadius: 120,
                          spreadRadius: 30,
                        ),
                        BoxShadow(
                          color: const Color(0xFFF9A03F).withValues(alpha: 0.4),
                          blurRadius: 60,
                          spreadRadius: 10,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: constraints.maxHeight),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center, // Center vertically
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Logo section
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.door_sliding_rounded, 
                                color: Color(0xFFF9A03F),
                                size: 36,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'FRESTA',
                                style: theme.textTheme.headlineLarge?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w300,
                                  letterSpacing: 4.0,
                                  fontSize: 40,
                                ),
                              ),
                            ],
                          ),
                          
                          const SizedBox(height: 60),

                          // Viewer Section (Glassmorphic)
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(32),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.2),
                                width: 1,
                              ),
                            ),
                            padding: const EdgeInsets.all(28),
                            child: Column(
                              children: [
                                Text(
                                  'Ver uma surpresa?',
                                  style: theme.textTheme.headlineSmall?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 24,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Insira o código recebido para abrir sua Fresta',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.7),
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 32),
                                TextField(
                                  controller: _linkController,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(color: Colors.white, fontSize: 18),
                                  decoration: InputDecoration(
                                    hintText: 'Colar código ou link',
                                    hintStyle: TextStyle(
                                      color: Colors.white.withValues(alpha: 0.4),
                                    ),
                                    prefixIcon: const Icon(Icons.paste_rounded, color: Colors.transparent), // for alignment
                                    suffixIcon: const Icon(Icons.content_paste_rounded, color: Color(0xFFF9A03F)),
                                    filled: true,
                                    fillColor: Colors.black.withValues(alpha: 0.3),
                                    contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide.none,
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide.none,
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide(
                                        color: _error != null ? const Color(0xFFDC2626) : const Color(0xFFF9A03F),
                                        width: 1.5,
                                      ),
                                    ),
                                  ),
                                  onSubmitted: (_) => _openLink(),
                                ),
                                if (_error != null) ...[
                                  const SizedBox(height: 12),
                                  Text(
                                    _error!,
                                    style: const TextStyle(color: Color(0xFFFCA5A5), fontSize: 14),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                                const SizedBox(height: 24),
                                FilledButton(
                                  onPressed: _openLink,
                                  style: FilledButton.styleFrom(
                                    backgroundColor: const Color(0xFFF9A03F),
                                    foregroundColor: const Color(0xFF1B4D3E),
                                    minimumSize: const Size.fromHeight(60),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                  ),
                                  child: const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Visualizar',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      SizedBox(width: 8),
                                      Icon(Icons.arrow_forward_rounded, size: 20),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 80),
                          
                          // Creator Section
                          FilledButton(
                            onPressed: () => context.go('/auth/login'),
                            style: FilledButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: const Color(0xFF1B4D3E),
                              minimumSize: const Size.fromHeight(64),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(999),
                              ),
                            ),
                            child: const Text(
                              'Criar minha conta',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          
                          const SizedBox(height: 16),
                          Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Já tenho conta - ',
                                  style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 15),
                                ),
                                GestureDetector(
                                  onTap: () => context.go('/auth/login'),
                                  child: const Text(
                                    'Entrar',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Paging dots (Visual indicator as seen in user screenshot)
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(width: 6, height: 6, decoration: const BoxDecoration(color: Colors.white54, shape: BoxShape.circle)),
                              const SizedBox(width: 8),
                              Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
                              const SizedBox(width: 8),
                              Container(width: 6, height: 6, decoration: const BoxDecoration(color: Colors.white54, shape: BoxShape.circle)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
