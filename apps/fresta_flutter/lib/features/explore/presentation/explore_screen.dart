import 'package:flutter/material.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        title: Text(
          'Explorar',
          style: theme.textTheme.titleLarge?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  color: Color(0xFFE8F5E0),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.travel_explore_rounded, size: 48, color: Color(0xFF2D7A5F)),
              ),
              const SizedBox(height: 32),
              const Text(
                'Novidades em Breve!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1B4D3E),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Estamos preparando ideias incríveis de calendários e presentes para você se inspirar. Fique de olho!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  color: Color(0xFF5A7470),
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
