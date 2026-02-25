import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class AppEntryScreen extends ConsumerWidget {
  const AppEntryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);

    if (auth.isLoading) {
      return Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFFF6F1E8), Color(0xFFEDE4D5)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 12),
                Text('Abrindo Fresta...'),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF6F1E8), Color(0xFFEDE4D5), Color(0xFFF8F4EC)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
            children: [
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFF164A3C),
                  borderRadius: BorderRadius.circular(26),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.14),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: const Text(
                        'Fresta · Calendários compartilháveis',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Crie momentos\npara abrir no tempo certo.',
                      style: theme.textTheme.headlineLarge?.copyWith(
                        color: Colors.white,
                        height: 1.03,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      auth.isAuthenticated
                          ? 'Você já está conectado. Entre no modo criador ou abra um calendário compartilhado.'
                          : 'Receba um link e visualize sem login. Quando quiser, entre para criar o seu e compartilhar também.',
                      style: const TextStyle(color: Color(0xFFE7E4DB), height: 1.35),
                    ),
                    const SizedBox(height: 18),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: const [
                        _Badge(label: 'Compartilhável'),
                        _Badge(label: 'Visualização instantânea'),
                        _Badge(label: 'Criação guiada'),
                        ],
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              _ActionCard(
                title: 'Visualizar um calendário',
                subtitle:
                    'Recebeu um link? O app abre direto em /c/:id. Você também pode navegar no modo visualização.',
                accent: const Color(0xFFD86F45),
                icon: Icons.visibility_outlined,
                actionLabel: 'Modo visualização',
                onTap: () => context.go('/viewer/welcome'),
              ),
              const SizedBox(height: 12),
              _ActionCard(
                title: auth.isAuthenticated ? 'Modo criador' : 'Criar meu calendário',
                subtitle: auth.isAuthenticated
                    ? 'Gerencie seus calendários, edite dias e compartilhe o link público.'
                    : 'Entre com Google ou link mágico para criar e editar seus calendários no app.',
                accent: const Color(0xFFB68A2A),
                icon: auth.isAuthenticated ? Icons.grid_view_rounded : Icons.auto_awesome_rounded,
                actionLabel: auth.isAuthenticated ? 'Abrir criador' : 'Entrar para criar',
                onTap: () => context.go(auth.isAuthenticated ? '/creator/home' : '/auth/login'),
              ),
              if (auth.isAuthenticated) ...[
                const SizedBox(height: 12),
                TextButton.icon(
                  onPressed: () => context.go('/account/profile'),
                  icon: const Icon(Icons.person_outline_rounded),
                  label: const Text('Ver perfil e configurações'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.title,
    required this.subtitle,
    required this.accent,
    required this.icon,
    required this.actionLabel,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final Color accent;
  final IconData icon;
  final String actionLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, color: accent),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(subtitle),
            const SizedBox(height: 14),
            FilledButton(
              onPressed: onTap,
              style: FilledButton.styleFrom(backgroundColor: accent),
              child: Text(actionLabel),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}
