import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class DiadasmaesThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'diadasmaes';

  @override
  Color get primaryColor => const Color(0xFFEC4899);

  @override
  Color get secondaryColor => const Color(0xFFF43F5E);

  @override
  Color get surfaceColor => const Color(0xFFFDF2F8);

  @override
  List<Color> get headerGradient => [const Color(0xFFEC4899), const Color(0xFFF43F5E)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFBE185D);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFEC4899);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFDF2F8);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Todo o meu amor para a melhor mãe do mundo';

  @override
  String get defaultFooterMessage => 'Obrigado por ser minha luz e inspiração!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _FloatingFlowers();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFEC4899).withValues(alpha: 0.2)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFEC4899).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _DiadasmaesBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.flower2;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _DiadasmaesBackground extends StatelessWidget {
  final Widget child;
  const _DiadasmaesBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(color: const Color(0xFFFDF2F8)),
        ),
        Positioned.fill(
          child: CustomPaint(painter: _FlowerPatternPainter()),
        ),
        child,
      ],
    );
  }
}

class _FlowerPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEC4899).withValues(alpha: 0.04)
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        // Cross pattern like the web version
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _FloatingFlowers extends StatefulWidget {
  const _FloatingFlowers();

  @override
  State<_FloatingFlowers> createState() => _FloatingFlowersState();
}

class _FloatingFlowersState extends State<_FloatingFlowers> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rng = Random(55);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(12, (i) {
            final yOff = _controller.value * 4 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.08,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Icon(
                    i % 3 == 0 ? LucideIcons.flower2 : Icons.favorite,
                    size: 10 + rng.nextDouble() * 8,
                    color: const Color(0xFFEC4899),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
