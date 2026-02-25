import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/utils/fresta_urls.dart';
import '../../../core/services/notification_service.dart';
import '../../calendars/data/saved_calendars_repository.dart';
import '../application/viewer_providers.dart';
import '../../../data/repositories/viewer_repository.dart';
import '../../../app/theme/dating_theme.dart';

class SharedCalendarViewerScreen extends ConsumerStatefulWidget {
  const SharedCalendarViewerScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  ConsumerState<SharedCalendarViewerScreen> createState() =>
      _SharedCalendarViewerScreenState();
}

class _SharedCalendarViewerScreenState
    extends ConsumerState<SharedCalendarViewerScreen> {
  final _passwordController = TextEditingController();
  bool _authorized = false;
  bool _verifying = false;
  bool _showPassword = false;
  String? _passwordError;

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _verifyPassword() async {
    setState(() {
      _verifying = true;
      _passwordError = null;
    });
    try {
      final ok = await ref.read(viewerRepositoryProvider).verifyPassword(
            widget.calendarId,
            _passwordController.text.trim(),
          );
      if (!mounted) return;
      setState(() {
        _authorized = ok;
        if (ok) _passwordController.clear();
        if (!ok) _passwordError = 'Senha incorreta';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _passwordError = 'Erro ao verificar a senha.');
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  Future<void> _openInBrowser() async {
    final url = Uri.parse(FrestaUrls.calendarShareUrl(widget.calendarId));
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final asyncMeta = ref.watch(sharedCalendarMetadataProvider(widget.calendarId));
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      body: asyncMeta.when(
        data: (meta) {
          if (meta == null) {
            return Scaffold(
              backgroundColor: const Color(0xFFF8F9F5),
              appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
              body: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: const [
                          BoxShadow(color: Color(0x0A000000), blurRadius: 20, offset: Offset(0, 8)),
                        ],
                      ),
                      child: const Icon(LucideIcons.searchX, size: 48, color: Color(0xFF9CA3AF)),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Calendário não encontrado.',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: const Color(0xFF5A7470),
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 32),
                    FilledButton(
                      onPressed: () => context.go('/'),
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF1B4D3E),
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Voltar para o Início', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            );
          }

          // Auto-save this calendar to local library
          Future.microtask(() {
            ref.read(savedCalendarsRepositoryProvider).saveCalendar(
                  SavedCalendar(
                    id: meta.calendar.id,
                    title: meta.calendar.title,
                    emoji: null,
                    savedAt: DateTime.now(),
                  ),
                );
            
            ref.read(notificationServiceProvider).scheduleCalendarReminder(
                  calendarId: meta.calendar.id,
                  title: meta.calendar.title,
                );
          });

          final needsPassword = meta.hasPassword && !_authorized;
          final asyncDays =
              needsPassword ? null : ref.watch(sharedCalendarDaysProvider(widget.calendarId));

          final isDating = meta.calendar.themeId == 'namoro';

          return Stack(
            children: [
              if (isDating) const FloatingHearts(),
              CustomScrollView(
                slivers: [
                  SliverAppBar(
                    backgroundColor: const Color(0xFFF8F9F5),
                    elevation: 0,
                    pinned: true,
                    centerTitle: true,
                    leading: Padding(
                      padding: const EdgeInsets.only(left: 8.0),
                      child: IconButton(
                        onPressed: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/');
                          }
                        },
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1B4D3E)),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    title: const Text(
                      'Fresta.',
                      style: TextStyle(
                        color: Color(0xFF1B4D3E),
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    actions: [
                      IconButton(
                        onPressed: () => SharePlus.instance.share(
                          ShareParams(text: FrestaUrls.calendarShareUrl(widget.calendarId)),
                        ),
                        icon: const Icon(LucideIcons.share, color: Color(0xFF1B4D3E)),
                        tooltip: 'Compartilhar',
                      ),
                      IconButton(
                        onPressed: _openInBrowser,
                        icon: const Icon(LucideIcons.globe, color: Color(0xFF1B4D3E)),
                        tooltip: 'Abrir no navegador',
                      ),
                      const SizedBox(width: 8),
                    ],
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
                      child: Column(
                        children: [
                          Center(
                            child: Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                gradient: isDating
                                    ? const LinearGradient(colors: DatingTheme.blushGradient)
                                    : const LinearGradient(
                                        colors: [Color(0xFFFFF7E6), Color(0xFFFDE6B5)],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      ),
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(
                                      color: (isDating ? DatingTheme.loveRed : const Color(0xFFF9A03F)).withValues(alpha: 0.2), 
                                      blurRadius: 20, 
                                      offset: const Offset(0, 8)),
                                ]
                              ),
                              child: Icon(
                                isDating ? Icons.favorite : LucideIcons.gift,
                                size: 40,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            meta.calendar.title,
                            textAlign: TextAlign.center,
                            style: isDating
                                ? DatingTheme.display.copyWith(color: DatingTheme.wineBerry, fontSize: 32)
                                : theme.textTheme.headlineMedium?.copyWith(
                                    color: const Color(0xFF1A3E3A),
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.5,
                                  ),
                          ),
                          const SizedBox(height: 16),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            alignment: WrapAlignment.center,
                            children: [
                              _InfoChip(icon: LucideIcons.calendarDays, label: '${meta.calendar.duration} dias'),
                              if (meta.hasPassword)
                                const _InfoChip(icon: LucideIcons.lock, label: 'Protegido', isAlert: true),
                            ],
                          ),
                          const SizedBox(height: 48),

                          if (needsPassword) ...[
                            Container(
                              padding: const EdgeInsets.all(32),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(32),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Color(0x0C000000),
                                    blurRadius: 32,
                                    offset: Offset(0, 12),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFF8F9F5),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(LucideIcons.lockKeyhole, size: 40, color: Color(0xFF2D7A5F)),
                                  ),
                                  const SizedBox(height: 24),
                                  const Text(
                                    'Acesso Restrito',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      color: Color(0xFF1B4D3E),
                                      fontWeight: FontWeight.w800,
                                      fontSize: 20,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Este calendário está protegido. Digite a senha para abri-lo.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(color: Color(0xFF5A7470), fontSize: 15, fontWeight: FontWeight.w500),
                                  ),
                                  const SizedBox(height: 32),
                                  TextField(
                                    controller: _passwordController,
                                    obscureText: !_showPassword,
                                    onSubmitted: (_) {
                                      if (!_verifying) _verifyPassword();
                                    },
                                    style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF1B4D3E)),
                                    decoration: InputDecoration(
                                      labelText: 'Senha do calendário',
                                      labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w500),
                                      prefixIcon: const Icon(LucideIcons.key, color: Color(0xFF9CA3AF)),
                                      filled: true,
                                      fillColor: const Color(0xFFF8F9F5),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(16),
                                        borderSide: BorderSide.none,
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(16),
                                        borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 1.5),
                                      ),
                                      suffixIcon: IconButton(
                                        onPressed: () =>
                                            setState(() => _showPassword = !_showPassword),
                                        icon: Icon(
                                          _showPassword
                                              ? LucideIcons.eyeOff
                                              : LucideIcons.eye,
                                          color: const Color(0xFF9CA3AF),
                                        ),
                                      ),
                                    ),
                                  ),
                                  if (_passwordError != null) ...[
                                    const SizedBox(height: 16),
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFFEF2F2),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(color: const Color(0xFFFCA5A5)),
                                      ),
                                      child: Row(
                                        children: [
                                          const Icon(LucideIcons.circleAlert, size: 20, color: Color(0xFFDC2626)),
                                          const SizedBox(width: 8),
                                          Text(
                                            _passwordError!,
                                            style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13, fontWeight: FontWeight.w600),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                  const SizedBox(height: 32),
                                  FilledButton(
                                    onPressed: _verifying ? null : _verifyPassword,
                                    style: FilledButton.styleFrom(
                                      backgroundColor: const Color(0xFF1B4D3E),
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    ),
                                    child: _verifying
                                        ? const SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                          )
                                        : const Text('Desbloquear Calendário', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                  ),
                                ],
                              ),
                            ),
                          ] else if (asyncDays != null)
                            ...asyncDays.when(
                              data: (days) {
                                if (days.isEmpty) {
                                  return [
                                    Container(
                                      padding: const EdgeInsets.all(40),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(32),
                                        boxShadow: const [
                                           BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
                                        ],
                                      ),
                                      child: Column(
                                        children: const [
                                          Icon(LucideIcons.inbox, size: 56, color: Color(0xFFD1D5DB)),
                                          SizedBox(height: 24),
                                          Text(
                                            'Calendário vazio',
                                            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF1B4D3E), letterSpacing: -0.5),
                                          ),
                                          SizedBox(height: 8),
                                          Text(
                                            'Nenhum dia foi adicionado ainda.',
                                            style: TextStyle(color: Color(0xFF6B7280), fontWeight: FontWeight.w500),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                                    )
                                  ];
                                }

                                return [
                                  for (final day in days)
                                    Container(
                                      margin: const EdgeInsets.only(bottom: 16),
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
                                      child: Material(
                                        color: Colors.transparent,
                                        child: InkWell(
                                          borderRadius: BorderRadius.circular(24),
                                          onTap: ((day.url ?? '').trim().isEmpty && (day.message ?? '').trim().isEmpty)
                                              ? null
                                              : () {
                                                  if (isDating) {
                                                    showModalBottomSheet(
                                                      context: context,
                                                      backgroundColor: Colors.transparent,
                                                      builder: (context) => NotebookModalContent(
                                                        title: 'Dia ${day.day}',
                                                        content: day.message ?? '',
                                                      ),
                                                    );
                                                    return;
                                                  }
                                                  final uri = Uri.tryParse(day.url!.trim());
                                                  if (uri == null) return;
                                                  launchUrl(
                                                    uri,
                                                    mode: LaunchMode.externalApplication,
                                                  );
                                                },
                                          child: Padding(
                                            padding: const EdgeInsets.all(20),
                                            child: Row(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Container(
                                                  width: 56,
                                                  height: 56,
                                                  padding: const EdgeInsets.all(2),
                                                  decoration: BoxDecoration(
                                                    gradient: LinearGradient(
                                                        colors: isDating ? DatingTheme.blushGradient : [const Color(0xFFF9A03F), const Color(0xFFFDE6B5)],
                                                        begin: Alignment.topLeft,
                                                        end: Alignment.bottomRight,
                                                    ),
                                                    borderRadius: BorderRadius.circular(20),
                                                  ),
                                                  child: Container(
                                                    decoration: BoxDecoration(
                                                      color: Colors.white,
                                                      borderRadius: BorderRadius.circular(18),
                                                    ),
                                                    child: Center(
                                                      child: Text(
                                                        '${day.day}',
                                                        style: const TextStyle(
                                                          color: Color(0xFFD86F45),
                                                          fontWeight: FontWeight.w900,
                                                          fontSize: 20,
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 20),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Row(
                                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                        children: [
                                                          Text(
                                                            'Dia ${day.day}',
                                                            style: const TextStyle(
                                                              fontWeight: FontWeight.w800,
                                                              color: Color(0xFF1B4D3E),
                                                              fontSize: 18,
                                                              letterSpacing: -0.5,
                                                            ),
                                                          ),
                                                          if (day.contentType != null)
                                                            Container(
                                                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                                              decoration: BoxDecoration(
                                                                color: const Color(0xFFF3F4F6),
                                                                borderRadius: BorderRadius.circular(8),
                                                              ),
                                                              child: Text(
                                                                day.contentType!,
                                                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF6B7280), letterSpacing: 0.5),
                                                              ),
                                                            ),
                                                        ],
                                                      ),
                                                      const SizedBox(height: 8),
                                                      Text(
                                                        [
                                                          if ((day.message ?? '').trim().isNotEmpty)
                                                            day.message!.trim(),
                                                          if ((day.url ?? '').trim().isNotEmpty) '🔗 ${(day.url ?? '').trim()}',
                                                        ].join('\n').ifEmpty('Momento reservado.'),
                                                        style: const TextStyle(
                                                          color: Color(0xFF5A7470),
                                                          height: 1.5,
                                                          fontWeight: FontWeight.w500,
                                                          fontSize: 15,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                ];
                              },
                              loading: () => const [
                                Padding(
                                  padding: EdgeInsets.symmetric(vertical: 48),
                                  child: Center(
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F)),
                                    ),
                                  ),
                                ),
                              ],
                              error: (error, _) => [
                                Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFEF2F2),
                                    borderRadius: BorderRadius.circular(24),
                                    border: Border.all(color: const Color(0xFFFCA5A5)),
                                  ),
                                  child: Column(
                                    children: [
                                      const Icon(LucideIcons.triangleAlert, size: 32, color: Color(0xFFDC2626)),
                                      const SizedBox(height: 16),
                                      const Text('Erro ao carregar os dias', style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF991B1B), fontSize: 16)),
                                      const SizedBox(height: 16),
                                      FilledButton.icon(
                                        onPressed: () => ref.invalidate(sharedCalendarDaysProvider(widget.calendarId)),
                                        icon: const Icon(LucideIcons.refreshCw, size: 18),
                                        label: const Text('Tentar novamente', style: TextStyle(fontWeight: FontWeight.bold)),
                                        style: FilledButton.styleFrom(
                                          backgroundColor: const Color(0xFFDC2626),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F)),
          ),
        ),
        error: (error, stackTrace) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFEF2F2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(LucideIcons.triangleAlert, size: 48, color: Color(0xFFDC2626)),
                ),
                const SizedBox(height: 24),
                Text(
                  'Não foi possível carregar',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800, color: const Color(0xFF991B1B), letterSpacing: -0.5),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Verifique sua conexão ou tente novamente recarregar o calendário.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF4B5563), fontSize: 15, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 32),
                FilledButton(
                  onPressed: () =>
                      ref.invalidate(sharedCalendarMetadataProvider(widget.calendarId)),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  ),
                  child: const Text('Tentar novamente', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.icon, required this.label, this.isAlert = false});

  final IconData icon;
  final String label;
  final bool isAlert;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isAlert ? const Color(0xFFFEF2F2) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isAlert ? const Color(0xFFFCA5A5) : const Color(0xFFE5E7EB)),
        boxShadow: const [
          BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: isAlert ? const Color(0xFFDC2626) : const Color(0xFF6B7280)),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: isAlert ? const Color(0xFF991B1B) : const Color(0xFF4B5563),
            ),
          ),
        ],
      ),
    );
  }
}

extension on String {
  String ifEmpty(String fallback) => trim().isEmpty ? fallback : this;
}
