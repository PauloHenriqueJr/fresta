import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../app/theme/theme_manager.dart';

/// All themes catalog — the user's go-to place to discover and choose a theme
class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  String _filter = 'all';

  static const _themes = <_ThemeEntry>[
    _ThemeEntry(id: 'aniversario', name: 'Aniversário', emoji: '🎂', category: 'celebration', desc: 'Torne o aniversário inesquecível com surpresas diárias'),
    _ThemeEntry(id: 'namoro', name: 'Amor & Romance', emoji: '❤️', category: 'romance', desc: 'Surpreenda quem você ama com mensagens de carinho'),
    _ThemeEntry(id: 'casamento', name: 'Nossa União', emoji: '💍', category: 'romance', desc: 'Celebre sua história de amor com elegância'),
    _ThemeEntry(id: 'noivado', name: 'Eternamente Juntos', emoji: '💎', category: 'romance', desc: 'Conte os dias até o grande momento'),
    _ThemeEntry(id: 'bodas', name: 'Bodas', emoji: '🥂', category: 'romance', desc: 'Reviva suas memórias mais preciosas'),
    _ThemeEntry(id: 'natal', name: 'Natal', emoji: '🎄', category: 'seasonal', desc: 'Um advento mágico de surpresas natalinas'),
    _ThemeEntry(id: 'reveillon', name: 'Réveillon', emoji: '🎆', category: 'seasonal', desc: 'Contagem regressiva para o ano novo'),
    _ThemeEntry(id: 'pascoa', name: 'Páscoa', emoji: '🐰', category: 'seasonal', desc: 'Caça aos ovos com carinho e criatividade'),
    _ThemeEntry(id: 'carnaval', name: 'Carnaval', emoji: '🎭', category: 'seasonal', desc: 'Folia e alegria em cada dia'),
    _ThemeEntry(id: 'saojoao', name: 'São João', emoji: '🔥', category: 'seasonal', desc: 'Festas juninas com quentão e amor'),
    _ThemeEntry(id: 'diadasmaes', name: 'Dia das Mães', emoji: '💐', category: 'celebration', desc: 'Homenageie a mulher mais especial'),
    _ThemeEntry(id: 'diadospais', name: 'Dia dos Pais', emoji: '👔', category: 'celebration', desc: 'Presente único para o herói da família'),
    _ThemeEntry(id: 'diadascriancas', name: 'Dia das Crianças', emoji: '🎮', category: 'celebration', desc: 'Diversão e magia para os pequenos'),
    _ThemeEntry(id: 'independencia', name: 'Independência', emoji: '🇧🇷', category: 'celebration', desc: 'Celebre o Brasil com orgulho'),
    _ThemeEntry(id: 'viagem', name: 'Viagem', emoji: '✈️', category: 'lifestyle', desc: 'Destinos e lembranças de aventuras'),
    _ThemeEntry(id: 'estudos', name: 'Estudos', emoji: '📚', category: 'lifestyle', desc: 'Rotina de estudos com motivação diária'),
    _ThemeEntry(id: 'metas', name: 'Metas', emoji: '🎯', category: 'lifestyle', desc: 'Conquiste seus objetivos passo a passo'),
  ];

  static const _categories = <String, String>{
    'all': 'Todos',
    'romance': 'Romance',
    'celebration': 'Celebrações',
    'seasonal': 'Sazonais',
    'lifestyle': 'Estilo de vida',
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final filtered = _filter == 'all' ? _themes : _themes.where((t) => t.category == _filter).toList();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // ── Header ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Explorar Temas', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: -1, color: colorScheme.onSurface)),
                    const SizedBox(height: 4),
                    Text('Escolha um tema e crie uma experiência única', style: TextStyle(fontSize: 14, color: colorScheme.onSurface.withValues(alpha: 0.5), fontWeight: FontWeight.w500)),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // ── Category Filters ──
            SliverToBoxAdapter(
              child: SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: _categories.entries.map((e) {
                    final isSelected = _filter == e.key;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(e.value, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: isSelected ? Colors.white : colorScheme.onSurface.withValues(alpha: 0.7))),
                        selected: isSelected,
                        onSelected: (_) => setState(() => _filter = e.key),
                        selectedColor: colorScheme.primary,
                        backgroundColor: colorScheme.surface,
                        side: BorderSide(color: isSelected ? Colors.transparent : colorScheme.onSurface.withValues(alpha: 0.1)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(99)),
                        showCheckmark: false,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Theme Grid ──
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              sliver: SliverGrid.count(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.72,
                children: filtered.map((t) => _ThemeCard(entry: t, onTap: () => context.go('/creator/calendars/new'))).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ThemeEntry {
  const _ThemeEntry({required this.id, required this.name, required this.emoji, required this.category, required this.desc});
  final String id;
  final String name;
  final String emoji;
  final String category;
  final String desc;
}

class _ThemeCard extends StatelessWidget {
  const _ThemeCard({required this.entry, required this.onTap});
  final _ThemeEntry entry;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final mascot = ThemeManager.getMascotAssetPath(entry.id);
    final themeConfig = ThemeManager.getTheme(entry.id);

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Image ──
              Expanded(
                flex: 5,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Container(color: themeConfig.primaryColor.withValues(alpha: 0.1)),
                    if (mascot != null)
                      Image.asset(
                        mascot,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Center(child: Text(entry.emoji, style: const TextStyle(fontSize: 40))),
                      )
                    else
                      Center(child: Text(entry.emoji, style: const TextStyle(fontSize: 40))),
                    // Gradient overlay
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.transparent, Colors.black.withValues(alpha: 0.2)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // ── Info ──
              Expanded(
                flex: 3,
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(entry.name, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: colorScheme.onSurface, letterSpacing: -0.2), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Text(entry.desc, style: TextStyle(fontSize: 11, color: colorScheme.onSurface.withValues(alpha: 0.5), height: 1.3), maxLines: 2, overflow: TextOverflow.ellipsis),
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
