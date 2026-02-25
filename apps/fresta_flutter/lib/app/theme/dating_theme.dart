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
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: const BoxDecoration(
        color: DatingTheme.romancePink,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Stack(
        children: [
          // Linhas horizontais (Efeito caderno)
          Positioned.fill(
            child: ListView.separated(
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (_, __) => const SizedBox(height: 30),
              separatorBuilder: (_, __) => Divider(
              color: Colors.blue.withValues(alpha: 0.1),
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
              Text(title, style: DatingTheme.display.copyWith(fontSize: 24)),
              const SizedBox(height: 24),
              Text(content, style: DatingTheme.body),
              const SizedBox(height: 40),
            ],
          ),
        ],
      ),
    );
  }
}
