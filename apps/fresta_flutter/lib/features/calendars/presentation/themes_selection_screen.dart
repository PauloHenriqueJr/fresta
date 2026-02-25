import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ThemeItem {
  final String id;
  final String title;
  final String category;
  final bool isPremium;
  final List<Color> gradientColors;
  final String imageAsset;

  const ThemeItem({
    required this.id,
    required this.title,
    required this.category,
    required this.isPremium,
    required this.gradientColors,
    required this.imageAsset,
  });
}

class ThemesSelectionScreen extends StatelessWidget {
  const ThemesSelectionScreen({super.key});

  static const List<ThemeItem> themes = [
    ThemeItem(
      id: 'namoro',
      title: 'Namoro Inesquecível',
      category: 'Romance',
      isPremium: false,
      gradientColors: [Color(0xFFE8F5E0), Color(0xFFC8E6C9)],
      imageAsset: 'assets/images/themes/mascot-namoro.jpg',
    ),
    ThemeItem(
      id: 'love',
      title: 'Amor & Paixão',
      category: 'Romance',
      isPremium: true,
      gradientColors: [Color(0xFFFFEBEE), Color(0xFFFFCDD2)],
      imageAsset: 'assets/images/themes/mascot-love.jpg',
    ),
    ThemeItem(
      id: 'noivado',
      title: 'O Sim Mais Importante',
      category: 'Romance',
      isPremium: true,
      gradientColors: [Color(0xFFF3E5F5), Color(0xFFE1BEE7)],
      imageAsset: 'assets/images/themes/mascot-noivado.jpg',
    ),
    ThemeItem(
      id: 'casamento',
      title: 'O Grande Dia',
      category: 'Romance',
      isPremium: true,
      gradientColors: [Color(0xFFFAFAFA), Color(0xFFE5E7EB)],
      imageAsset: 'assets/images/themes/mascot-casamento.jpg',
    ),
    ThemeItem(
      id: 'aniversario',
      title: 'Aniversário Mágico',
      category: 'Celebração',
      isPremium: false,
      gradientColors: [Color(0xFFFFF7E6), Color(0xFFFFE0B2)],
      imageAsset: 'assets/images/themes/mascot-aniversario.jpg',
    ),
    ThemeItem(
      id: 'bodas',
      title: 'Bodas de Amor',
      category: 'Celebração',
      isPremium: true,
      gradientColors: [Color(0xFFFFF7E6), Color(0xFFFFE0B2)],
      imageAsset: 'assets/images/themes/mascot-bodas.jpg',
    ),
    ThemeItem(
      id: 'viagem',
      title: 'Próxima Aventura',
      category: 'Viagem',
      isPremium: false,
      gradientColors: [Color(0xFFE3F2FD), Color(0xFFBBDEFB)],
      imageAsset: 'assets/images/themes/mascot-viagem.jpg',
    ),
    ThemeItem(
      id: 'natal',
      title: 'Natal em Família',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFFFEBEE), Color(0xFFFFCDD2)],
      imageAsset: 'assets/images/themes/mascot-natal.jpg',
    ),
    ThemeItem(
      id: 'reveillon',
      title: 'Ano Novo Novo Eu',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFE0F2F1), Color(0xFFB2DFDB)],
      imageAsset: 'assets/images/themes/mascot-reveillon.jpg',
    ),
    ThemeItem(
      id: 'pascoa',
      title: 'Páscoa Doce',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFFFF3E0), Color(0xFFFFE0B2)],
      imageAsset: 'assets/images/themes/mascot-pascoa.jpg',
    ),
    ThemeItem(
      id: 'diadasmaes',
      title: 'Melhor Mãe do Mundo',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFFCE4EC), Color(0xFFF8BBD0)],
      imageAsset: 'assets/images/themes/mascot-diadasmaes.jpg',
    ),
    ThemeItem(
      id: 'diadospais',
      title: 'Meu Herói',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFE8EAF6), Color(0xFFC5CAE9)],
      imageAsset: 'assets/images/themes/mascot-diadospais.jpg',
    ),
    ThemeItem(
      id: 'diadascriancas',
      title: 'Diversão Pura',
      category: 'Sazonal',
      isPremium: false,
      gradientColors: [Color(0xFFFFF9C4), Color(0xFFFFF176)],
      imageAsset: 'assets/images/themes/mascot-diadascriancas.jpg',
    ),
    ThemeItem(
      id: 'estudo',
      title: 'Rotina de Estudos',
      category: 'Produtividade',
      isPremium: false,
      gradientColors: [Color(0xFFEFEBE9), Color(0xFFD7CCC8)],
      imageAsset: 'assets/images/themes/mascot-estudo.jpg',
    ),
    ThemeItem(
      id: 'metas',
      title: 'Foco e Metas',
      category: 'Produtividade',
      isPremium: false,
      gradientColors: [Color(0xFFF1F8E9), Color(0xFFDCEDC8)],
      imageAsset: 'assets/images/themes/mascot-metas.jpg',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFF1B4D3E)),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Explorar Temas',
          style: theme.textTheme.titleLarge?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: Text(
                'Escolha o tema perfeito para sua próxima surpresa.',
                style: TextStyle(
                  color: Color(0xFF5A7470),
                  fontSize: 15,
                  height: 1.4,
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.75,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final item = themes[index];
                  return _ThemeCard(themeItem: item);
                },
                childCount: themes.length,
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _ThemeCard extends StatelessWidget {
  const _ThemeCard({required this.themeItem});

  final ThemeItem themeItem;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
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
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            // Navigate to create with this theme
            context.go('/creator/calendars/new?themeId=${themeItem.id}');
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: themeItem.gradientColors,
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: Image.asset(
                          themeItem.imageAsset,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Center(
                            child: Icon(Icons.image_outlined, color: Colors.black26),
                          ),
                        ),
                      ),
                      if (themeItem.isPremium)
                        Positioned(
                          top: 12,
                          right: 12,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: Color(0xFF1B4D3E),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.star_rounded, size: 14, color: Color(0xFFF9A03F)),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      themeItem.category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFF9A03F),
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      themeItem.title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1B4D3E),
                        height: 1.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
