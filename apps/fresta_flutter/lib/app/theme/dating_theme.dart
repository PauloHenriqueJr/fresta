import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DatingTheme {
  // Cores Web Mapeadas
  static const loveRed = Color(0xFFE11D48);
  static const wineBerry = Color(0xFF881337);
  static const romancePink = Color(0xFFFFFAFA);
  static const lightRose = Color(0xFFFDF2F8);
  static const blushGradient = [Color(0xFFF43F5E), Color(0xFFEC4899)];

  static TextStyle get display {
    return GoogleFonts.playfairDisplay(
      fontWeight: FontWeight.bold,
      fontStyle: FontStyle.italic,
      color: wineBerry,
      fontSize: 32,
    );
  }

  static TextStyle get body {
    return GoogleFonts.plusJakartaSans(
      color: wineBerry.withValues(alpha: 0.8),
      fontSize: 16,
      fontWeight: FontWeight.w500,
    );
  }

  static BoxDecoration get cardDecoration {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: loveRed.withValues(alpha: 0.2), width: 2),
      boxShadow: [
        BoxShadow(
          color: loveRed.withValues(alpha: 0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }
}

class FloatingHearts extends StatefulWidget {
  const FloatingHearts({super.key});

  @override
  State<FloatingHearts> createState() => _FloatingHeartsState();
}

class _FloatingHeartsState extends State<FloatingHearts> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(15, (index) {
            final yOffset = _controller.value * 5 * (index % 2 == 0 ? 1 : -1);
            return Positioned(
              left: (index * 25.0) % MediaQuery.of(context).size.width,
              top: (index * 60.0) % MediaQuery.of(context).size.height,
              child: Opacity(
                opacity: 0.1,
                child: Transform.translate(
                  offset: Offset(0, yOffset),
                  child: const Icon(Icons.favorite, color: DatingTheme.loveRed, size: 12),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

class NotebookModalContent extends StatelessWidget {
  final String content;
  final String title;

  const NotebookModalContent({
    super.key,
    required this.content,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : DatingTheme.romancePink;
    final titleColor = isDark ? Colors.white : DatingTheme.wineBerry;
    final textColor = isDark ? Colors.white70 : DatingTheme.wineBerry.withValues(alpha: 0.8);
    final lineColor = isDark ? Colors.white.withValues(alpha: 0.05) : Colors.blue.withValues(alpha: 0.1);

    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Stack(
        children: [
          // Linhas horizontais (Efeito caderno)
          Positioned.fill(
            child: ListView.separated(
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (_, __) => const SizedBox(height: 30),
              separatorBuilder: (_, __) => Divider(
                color: lineColor,
                thickness: 1,
                height: 0,
              ),
              itemCount: 20,
            ),
          ),
          // Linha vertical vermelha
          Positioned(
            left: 20,
            top: 0,
            bottom: 0,
            child: Container(
              width: 1,
              color: DatingTheme.loveRed.withValues(alpha: 0.3),
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: DatingTheme.display.copyWith(fontSize: 24, color: titleColor)),
              const SizedBox(height: 24),
              Text(content, style: DatingTheme.body.copyWith(color: textColor)),
              const SizedBox(height: 40),
            ],
          ),
        ],
      ),
    );
  }
}

class HangingHeartsHeader extends StatelessWidget {
  const HangingHeartsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      width: double.infinity,
      child: Stack(
        children: [
          ...List.generate(6, (index) {
            final double left = 30.0 + (index * 60.0);
            final double height = 40.0 + (index % 3 * 20.0);
            return Positioned(
              left: left,
              top: 0,
              child: Column(
                children: [
                  Container(
                    width: 1,
                    height: height,
                    color: DatingTheme.loveRed.withValues(alpha: 0.3),
                  ),
                  Icon(
                    Icons.favorite,
                    size: 16,
                    color: DatingTheme.loveRed.withValues(alpha: index % 2 == 0 ? 0.6 : 0.4),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class DatingBackground extends StatelessWidget {
  final Widget child;
  const DatingBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: CustomPaint(
            painter: _PatternPainter(),
          ),
        ),
        child,
      ],
    );
  }
}

class _PatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = DatingTheme.loveRed.withValues(alpha: 0.03)
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        // Draw a small '+'
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
