import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class CreatorHomeScreen extends ConsumerWidget {
  const CreatorHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);
    final displayName = auth.profile?.displayName ?? auth.user?.email ?? 'Criador';

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Fresta',
          style: theme.textTheme.headlineMedium?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () => context.go('/account/profile'),
            icon: const Icon(Icons.person_outline_rounded, color: Color(0xFF1B4D3E)),
            tooltip: 'Perfil',
          ),
          IconButton(
            onPressed: () async {
              await ref.read(authControllerProvider.notifier).signOut();
              if (context.mounted) context.go('/viewer/welcome');
            },
            icon: const Icon(Icons.logout_rounded, color: Color(0xFF1B4D3E)),
            tooltip: 'Sair',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 100),
          children: [
            // Premium Welcome Header
            Text(
              'Olá, ${displayName.split('@').first}',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: const Color(0xFF1B4D3E),
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Qual surpresa vamos preparar hoje?',
              style: TextStyle(
                color: Color(0xFF5A7470),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 32),

            // Main Featured Concept Card
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x331B4D3E),
                    blurRadius: 32,
                    offset: Offset(0, 16),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF1B4D3E), Color(0xFF2D7A5F)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: -40,
                    right: -40,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [Color(0x30F9A03F), Colors.transparent],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9A03F),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Text(
                            'Novo Tema Disponível',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Aniversário\nInesquecível',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            height: 1.1,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Um tema vibrante para celebrar mais um ano de vida com surpresas diárias.',
                          style: TextStyle(
                            color: Color(0xFFE8F5E0),
                            height: 1.4,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 24),
                        FilledButton(
                          onPressed: () => context.go('/creator/calendars/new'),
                          style: FilledButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF1B4D3E),
                            minimumSize: const Size(140, 48),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          child: const Text('Usar Tema', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),

            // Theme Discovery Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Explore Temas',
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: const Color(0xFF1B4D3E),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF2D7A5F),
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                  ),
                  child: const Text('Ver todos', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            SizedBox(
              height: 200,
              child: ListView(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                children: [
                  _ThemePreviewCard(
                    title: 'Namoro\nInesquecível',
                    category: 'Romance',
                    isPremium: false,
                    gradientColors: const [Color(0xFFE8F5E0), Color(0xFFC8E6C9)],
                    imageAsset: 'assets/images/themes/mascot-namoro.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Casamento\nPerfeito',
                    category: 'Amor',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFFF3E0), Color(0xFFFFE0B2)],
                    imageAsset: 'assets/images/themes/casamento.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Feliz\nAniversário',
                    category: 'Celebração',
                    isPremium: false,
                    gradientColors: const [Color(0xFFE0E7FF), Color(0xFFC7D2FE)],
                    imageAsset: 'assets/images/themes/mascot-aniversario.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Nossas\nBodas',
                    category: 'Romance',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFCE7F3), Color(0xFFFBCFE8)],
                    imageAsset: 'assets/images/themes/mascot-bodas.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Especial\nCarnaval',
                    category: 'Festa',
                    isPremium: false,
                    gradientColors: const [Color(0xFFFDF4FF), Color(0xFFF5D0FE)],
                    imageAsset: 'assets/images/themes/carnaval.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Dia das\nCrianças',
                    category: 'Família',
                    isPremium: false,
                    gradientColors: const [Color(0xFFE0F2FE), Color(0xFFBAE6FD)],
                    imageAsset: 'assets/images/themes/mascot-diadascriancas.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Dia das\nMães',
                    category: 'Família',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFFF1F2), Color(0xFFFECDD3)],
                    imageAsset: 'assets/images/themes/mascot-diadasmaes.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Dia dos\nPais',
                    category: 'Família',
                    isPremium: false,
                    gradientColors: const [Color(0xFFEFF6FF), Color(0xFFDBEAFE)],
                    imageAsset: 'assets/images/themes/mascot-diadospais.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Foco nos\nEstudos',
                    category: 'Metas',
                    isPremium: false,
                    gradientColors: const [Color(0xFFF3F4F6), Color(0xFFE5E7EB)],
                    imageAsset: 'assets/images/themes/mascot-estudo.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Independência\ndo Brasil',
                    category: 'Feriado',
                    isPremium: false,
                    gradientColors: const [Color(0xFFECFCCB), Color(0xFFD9F99D)],
                    imageAsset: 'assets/images/themes/independencia.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Nossas\nMetas',
                    category: 'Metas',
                    isPremium: false,
                    gradientColors: const [Color(0xFFFEF3C7), Color(0xFFFDE68A)],
                    imageAsset: 'assets/images/themes/mascot-metas.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Feliz\nNatal',
                    category: 'Feriado',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFEF2F2), Color(0xFFFECACA)],
                    imageAsset: 'assets/images/themes/natal.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Nosso\nNoivado',
                    category: 'Amor',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFAF5FF), Color(0xFFE9D5FF)],
                    imageAsset: 'assets/images/themes/mascot-noivado.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Feliz\nPáscoa',
                    category: 'Feriado',
                    isPremium: false,
                    gradientColors: const [Color(0xFFFFF7ED), Color(0xFFFFEDD5)],
                    imageAsset: 'assets/images/themes/pascoa.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Feliz\nRéveillon',
                    category: 'Festa',
                    isPremium: true,
                    gradientColors: const [Color(0xFFF8FAFC), Color(0xFFF1F5F9)],
                    imageAsset: 'assets/images/themes/reveillon.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Viva\nSão João',
                    category: 'Festa',
                    isPremium: false,
                    gradientColors: const [Color(0xFFFEF9C3), Color(0xFFFEF08A)],
                    imageAsset: 'assets/images/themes/saojoao.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 16),
                  _ThemePreviewCard(
                    title: 'Viagem dos\nSonhos',
                    category: 'Lazer',
                    isPremium: true,
                    gradientColors: const [Color(0xFFF0FDF4), Color(0xFFDCFCE7)],
                    imageAsset: 'assets/images/themes/mascot-viagem.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ThemePreviewCard extends StatelessWidget {
  final String title;
  final String category;
  final bool isPremium;
  final List<Color> gradientColors;
  final String imageAsset;
  final VoidCallback onTap;

  const _ThemePreviewCard({
    required this.title,
    required this.category,
    required this.isPremium,
    required this.gradientColors,
    required this.imageAsset,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 16,
            offset: Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.white,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                flex: 3,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: Image.asset(
                          imageAsset,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Colors.transparent, Colors.black.withValues(alpha: 0.1)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                        ),
                      ),
                      if (isPremium)
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Color(0xFFF9A03F),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.star_rounded, color: Colors.white, size: 12),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              Expanded(
                flex: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        category,
                        style: TextStyle(
                          color: const Color(0xFF5A7470).withValues(alpha: 0.8),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        title,
                        style: const TextStyle(
                          color: Color(0xFF1B4D3E),
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          height: 1.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

