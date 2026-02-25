import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';
import '../../calendars/data/saved_calendars_repository.dart';
import '../../../core/services/notification_service.dart';
import 'package:intl/intl.dart';

class AppEntryScreen extends ConsumerStatefulWidget {
  const AppEntryScreen({super.key});

  @override
  ConsumerState<AppEntryScreen> createState() => _AppEntryScreenState();
}

class _AppEntryScreenState extends ConsumerState<AppEntryScreen> {
  final _linkController = TextEditingController();
  String? _error;

  @override
  void initState() {
    super.initState();
    // Auto-redirect if already authenticated
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = ref.read(authControllerProvider);
      if (auth.isAuthenticated) {
        context.go('/creator/home');
      }
    });
  }

  @override
  void dispose() {
    _linkController.dispose();
    super.dispose();
  }

  void _openLink() {
    final value = _linkController.text.trim();
    if (value.isEmpty) {
      setState(() => _error = 'Por favor, insira o link ou ID.');
      return;
    }

    Uri? uri = Uri.tryParse(value);
    if (uri == null) {
      if (_looksLikeCalendarId(value)) {
        context.go('/c/$value');
        return;
      }
      setState(() => _error = 'Link inválido. Ex: fresta.app/c/<id>');
      return;
    }

    String? id;
    if (uri.pathSegments.length >= 2 && uri.pathSegments.first == 'c') {
      id = uri.pathSegments[1];
    } else if (value.startsWith('/c/')) {
      id = value.substring(3);
    } else if (_looksLikeCalendarId(value)) {
      id = value;
    }

    if (id != null && id.isNotEmpty && mounted) {
      setState(() => _error = null);
      context.go('/c/$id');
      return;
    }

    setState(() => _error = 'ID do calendário não encontrado no link.');
  }

  bool _looksLikeCalendarId(String value) {
    final v = value.trim();
    if (v.isEmpty) return false;
    if (v.contains(' ')) return false;
    if (v.contains('/')) return false;
    return v.length >= 8;
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final size = MediaQuery.of(context).size;

    // If suddenly authenticated (e.g. from callback), go to home
    ref.listen(authControllerProvider, (previous, next) {
      if (!(previous?.isAuthenticated ?? false) && next.isAuthenticated) {
        context.go('/creator/home');
      }
    });

    if (auth.isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F1A16),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(colorScheme.secondary),
              ),
              const SizedBox(height: 24),
              Text(
                'Abrindo Fresta...',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F1A16),
      body: Stack(
        children: [
          // Cinematic Background with "Fresta" light effect
          Positioned.fill(
            child: Container(
              color: const Color(0xFF0F1A16),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 2,
                    height: size.height,
                    decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                          color: colorScheme.secondary.withValues(alpha: 0.6),
                          blurRadius: 150,
                          spreadRadius: 40,
                        ),
                        BoxShadow(
                          color: colorScheme.secondary.withValues(alpha: 0.3),
                          blurRadius: 80,
                          spreadRadius: 20,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: constraints.maxHeight),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Logo section with enhanced typography
                          Column(
                            children: [
                              Icon(
                                Icons.door_sliding_rounded, 
                                color: colorScheme.secondary,
                                size: 48,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'FRESTA',
                                style: theme.textTheme.headlineLarge?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w200,
                                  letterSpacing: 8.0,
                                  fontSize: 42,
                                ),
                              ),
                            ],
                          ),
                          
                          const SizedBox(height: 60),

                          // Viewer Section (Premium Glassmorphism)
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(32),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.1),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.2),
                                  blurRadius: 20,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            padding: const EdgeInsets.all(32),
                            child: Column(
                              children: [
                                Text(
                                  'Ver uma surpresa?',
                                  style: theme.textTheme.headlineSmall?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 26,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Insira o link ou código da sua Fresta',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.5),
                                    fontSize: 15,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 32),
                                TextField(
                                  controller: _linkController,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600),
                                  decoration: InputDecoration(
                                    hintText: 'Link ou código',
                                    hintStyle: TextStyle(
                                      color: Colors.white.withValues(alpha: 0.2),
                                    ),
                                    suffixIcon: Icon(Icons.qr_code_scanner_rounded, color: colorScheme.secondary),
                                    filled: true,
                                    fillColor: Colors.white.withValues(alpha: 0.05),
                                    contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide.none,
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide.none,
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      borderSide: BorderSide(
                                        color: _error != null ? colorScheme.error : colorScheme.secondary,
                                        width: 1.5,
                                      ),
                                    ),
                                  ),
                                  onSubmitted: (_) => _openLink(),
                                ),
                                if (_error != null) ...[
                                  const SizedBox(height: 12),
                                  Text(
                                    _error!,
                                    style: TextStyle(color: colorScheme.error.withValues(alpha: 0.8), fontSize: 13, fontWeight: FontWeight.w600),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                                const SizedBox(height: 32),
                                FilledButton(
                                  onPressed: _openLink,
                                  style: FilledButton.styleFrom(
                                    backgroundColor: colorScheme.secondary,
                                    foregroundColor: Colors.white,
                                    minimumSize: const Size.fromHeight(64),
                                    elevation: 10,
                                    shadowColor: colorScheme.secondary.withValues(alpha: 0.4),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                  ),
                                  child: const Text(
                                    'Abrir Fresta',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Saved Calendars Library
                          ref.watch(savedCalendarsProvider).when(
                            data: (saved) {
                              if (saved.isEmpty) return const SizedBox.shrink();
                              return Padding(
                                padding: const EdgeInsets.only(top: 48),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 8),
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'RECUPERAR SURPRESA',
                                            style: theme.textTheme.labelSmall?.copyWith(
                                              color: Colors.white.withValues(alpha: 0.4),
                                              fontWeight: FontWeight.w900,
                                              letterSpacing: 1.5,
                                            ),
                                          ),
                                          Icon(Icons.history_rounded, size: 16, color: Colors.white.withValues(alpha: 0.3)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Container(
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.03),
                                        borderRadius: BorderRadius.circular(28),
                                        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
                                      ),
                                      clipBehavior: Clip.antiAlias,
                                      child: Column(
                                        children: [
                                          for (int i = 0; i < saved.length; i++) ...[
                                            _SavedCalendarTile(
                                              calendar: saved[i],
                                              onTap: () => context.go('/c/${saved[i].id}'),
                                              onRemove: () {
                                                ref.read(notificationServiceProvider).cancelCalendarReminder(saved[i].id);
                                                ref.read(savedCalendarsRepositoryProvider).removeCalendar(saved[i].id);
                                                ref.invalidate(savedCalendarsProvider);
                                              },
                                            ),
                                            if (i < saved.length - 1)
                                              Divider(height: 1, color: Colors.white.withValues(alpha: 0.05), indent: 76),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                            loading: () => const SizedBox.shrink(),
                            error: (e, s) => const SizedBox.shrink(),
                          ),

                          const SizedBox(height: 64),
                          
                          // Creator Area - Visual distinction
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: FilledButton(
                              onPressed: () => context.go('/auth/login'),
                              style: FilledButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF0F1A16),
                                minimumSize: const Size.fromHeight(60),
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                              child: const Text(
                                'Logar como Criador',
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ),
                          
                          const SizedBox(height: 16),
                          Center(
                            child: TextButton(
                              onPressed: () => context.go('/auth/login'),
                              style: TextButton.styleFrom(
                                foregroundColor: Colors.white.withValues(alpha: 0.6),
                              ),
                              child: const Text(
                                'Não tem conta? Comece aqui',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Paging dots (Visual indicator)
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.white24, shape: BoxShape.circle)),
                              const SizedBox(width: 8),
                              Container(width: 8, height: 8, decoration: BoxDecoration(color: colorScheme.secondary, shape: BoxShape.circle)),
                              const SizedBox(width: 8),
                              Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.white24, shape: BoxShape.circle)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _SavedCalendarTile extends StatelessWidget {
  const _SavedCalendarTile({
    required this.calendar,
    required this.onTap,
    required this.onRemove,
  });

  final SavedCalendar calendar;
  final VoidCallback onTap;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: Text(
                    calendar.emoji ?? '🎁', 
                    style: const TextStyle(fontSize: 24)
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      calendar.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 16,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Visto em ${DateFormat('dd/MM HH:mm').format(calendar.savedAt)}',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.3),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: onRemove,
                icon: const Icon(Icons.close_rounded, size: 20, color: Colors.white24),
                tooltip: 'Remover',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
