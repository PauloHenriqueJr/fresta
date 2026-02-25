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

    if (auth.isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8F9F5),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F)),
              ),
              const SizedBox(height: 24),
              Text(
                'Abrindo Fresta...',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: const Color(0xFF1B4D3E),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      body: Stack(
        children: [
            // Cinematic Background with "Fresta" light effect
          Positioned.fill(
            child: Container(
              color: const Color(0xFF13362B), // Very deep green, darker than primary
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Center glowing crack (Fresta)
                  Container(
                    width: 4,
                    height: size.height,
                    decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF9A03F).withValues(alpha: 0.8), // Muted Gold glow
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
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: constraints.maxHeight),
                    child: IntrinsicHeight(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                const SizedBox(height: 48),
                // Logo section
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.door_sliding_rounded, 
                        color: Color(0xFFF9A03F),
                        size: 32,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Fresta',
                        style: theme.textTheme.headlineLarge?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w300,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 48),

                // Viewer Section (Glassmorphic)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.2),
                        width: 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        Text(
                          'Ver uma surpresa?',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _linkController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Colar código ou link',
                            hintStyle: TextStyle(
                              color: Colors.white.withValues(alpha: 0.5),
                            ),
                            filled: true,
                            fillColor: Colors.black.withValues(alpha: 0.2),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide.none,
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: _error != null ? const Color(0xFFDC2626) : const Color(0xFFF9A03F),
                                width: 1,
                              ),
                            ),
                          ),
                          onSubmitted: (_) => _openLink(),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, color: Color(0xFFFCA5A5), size: 16),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _error!,
                                  style: const TextStyle(color: Color(0xFFFCA5A5), fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                        ],
                        const SizedBox(height: 16),
                        FilledButton(
                          onPressed: _openLink,
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFFF9A03F), // Muted Gold
                            foregroundColor: const Color(0xFF1B4D3E), // Deep green text
                            minimumSize: const Size.fromHeight(56),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: const Text(
                            'Visualizar',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 32),
                
                // Separator
                Row(
                  children: [
                    Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2), indent: 48, endIndent: 16)),
                    Text('ou', style: TextStyle(color: Colors.white.withValues(alpha: 0.5))),
                    Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2), indent: 16, endIndent: 48)),
                  ],
                ),

                const SizedBox(height: 32),

                // Creator Section
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: FilledButton(
                    onPressed: () {
                      if (auth.isAuthenticated) {
                        context.go('/creator/home');
                      } else {
                        context.go('/auth/login');
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF1B4D3E),
                      minimumSize: const Size.fromHeight(60),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: Text(
                      auth.isAuthenticated ? 'Ir para Meus Calendários' : 'Criar minha conta',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                
                if (!auth.isAuthenticated) ...[
                  const SizedBox(height: 16),
                  Center(
                    child: TextButton(
                      onPressed: () => context.go('/auth/login'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white.withValues(alpha: 0.8),
                      ),
                      child: const Text(
                        'Já tenho conta — Entrar',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 48),
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

