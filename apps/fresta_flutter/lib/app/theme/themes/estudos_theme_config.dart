import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Estudos (Study) — Clean blue/teal academic theme
class EstudosThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'estudos';

  @override
  Color get primaryColor => const Color(0xFF0891B2);

  @override
  Color get secondaryColor => const Color(0xFF0D9488);

  @override
  Color get surfaceColor => const Color(0xFFF0FDFA);

  @override
  List<Color> get headerGradient => [const Color(0xFF0891B2), const Color(0xFF0D9488)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF0E7490);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF0891B2);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFF0FDFA);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.outfit(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _StudyElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF0891B2).withValues(alpha: 0.2)),
      boxShadow: [BoxShadow(color: const Color(0xFF0891B2).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return Stack(children: [
      Positioned.fill(child: Container(color: const Color(0xFFF0FDFA))),
      Positioned.fill(child: CustomPaint(painter: _StudyPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.bookOpen;
  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _StudyPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF0891B2).withValues(alpha: 0.03)..strokeWidth = 1;
    const s = 40.0;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _StudyElements extends StatefulWidget {
  const _StudyElements();
  @override
  State<_StudyElements> createState() => _StudyElementsState();
}

class _StudyElementsState extends State<_StudyElements> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(44);
    final icons = [LucideIcons.bookOpen, LucideIcons.pencil, LucideIcons.graduationCap, LucideIcons.brain];
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(10, (i) {
        final y = _c.value * 3 * (i % 2 == 0 ? 1 : -1);
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 14), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 14),
          child: Opacity(opacity: 0.06, child: Transform.translate(offset: Offset(0, y),
            child: Icon(icons[i % icons.length], size: 10 + rng.nextDouble() * 6, color: const Color(0xFF0891B2)))));
      }),
    ));
  }
}
