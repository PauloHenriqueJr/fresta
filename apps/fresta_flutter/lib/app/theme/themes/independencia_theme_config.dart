import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Independência (Independence Day / Brazil) — Green & yellow patriotic theme
class IndependenciaThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'independencia';

  @override
  Color get primaryColor => const Color(0xFF16A34A);

  @override
  Color get secondaryColor => const Color(0xFFEAB308);

  @override
  Color get surfaceColor => const Color(0xFFF0FDF4);

  @override
  List<Color> get headerGradient => [const Color(0xFF16A34A), const Color(0xFFEAB308)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF15803D);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF166534);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFF0FDF4);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w700);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Celebrando a nossa liberdade e história!';

  @override
  String get defaultFooterMessage => 'Orgulho de construir nossa própria história juntos.';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _IndependenciaElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF16A34A).withValues(alpha: 0.3)),
      boxShadow: [BoxShadow(color: const Color(0xFF16A34A).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return Stack(children: [
      Positioned.fill(child: Container(color: const Color(0xFFF0FDF4))),
      Positioned.fill(child: CustomPaint(painter: _IndependenciaPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.flag;
  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _IndependenciaPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final green = Paint()..color = const Color(0xFF16A34A).withValues(alpha: 0.03);
    final yellow = Paint()..color = const Color(0xFFEAB308).withValues(alpha: 0.03);
    const s = 50.0;
    bool alt = false;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        canvas.drawCircle(Offset(x, y), 3, alt ? yellow : green);
        alt = !alt;
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _IndependenciaElements extends StatefulWidget {
  const _IndependenciaElements();
  @override
  State<_IndependenciaElements> createState() => _IndependenciaElementsState();
}

class _IndependenciaElementsState extends State<_IndependenciaElements> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(77);
    final colors = [const Color(0xFF16A34A), const Color(0xFFEAB308), const Color(0xFF2563EB)];
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(10, (i) {
        final y = _c.value * 3 * (i % 2 == 0 ? 1 : -1);
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 14), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 14),
          child: Opacity(opacity: 0.07, child: Transform.translate(offset: Offset(0, y),
            child: Icon(i % 3 == 0 ? LucideIcons.flag : LucideIcons.star, size: 10 + rng.nextDouble() * 6, color: colors[i % colors.length]))));
      }),
    ));
  }
}
