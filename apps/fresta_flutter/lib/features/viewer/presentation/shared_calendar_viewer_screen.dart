import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';

import '../../../core/utils/fresta_urls.dart';
import '../../../core/services/notification_service.dart';
import '../../calendars/data/saved_calendars_repository.dart';
import '../application/viewer_providers.dart';
import '../../../data/repositories/viewer_repository.dart';
import '../../../app/theme/dating_theme.dart';
import '../../../app/theme/theme_manager.dart';
import '../../../shared/widgets/fresta_ad_banner.dart';
import '../../auth/application/auth_controller.dart';

class SharedCalendarViewerScreen extends ConsumerStatefulWidget {
  const SharedCalendarViewerScreen({super.key, required this.calendarId, this.isPreview = false});

  final String calendarId;
  final bool isPreview;

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
  void initState() {
    super.initState();
    // Invalidate cached data so preview always shows fresh theme
    if (widget.isPreview) {
      Future.microtask(() {
        ref.invalidate(sharedCalendarMetadataProvider(widget.calendarId));
        ref.invalidate(sharedCalendarDaysProvider(widget.calendarId));
      });
    }
  }

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

  bool _isDayLocked(DateTime? createdAt, int day) {
    if (createdAt == null) return false;
    final startDate = DateTime(createdAt.year, createdAt.month, createdAt.day);
    final availableDate = startDate.add(Duration(days: day - 1));
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return today.isBefore(availableDate);
  }

  DateTime _getAvailableDate(DateTime? createdAt, int day) {
    if (createdAt == null) return DateTime.now();
    final startDate = DateTime(createdAt.year, createdAt.month, createdAt.day);
    return startDate.add(Duration(days: day - 1));
  }

  void _showLockedMessage(DateTime availableDate) {
    final dateStr = DateFormat('dd/MM').format(availableDate);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(LucideIcons.lock, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Text('Este presente só estará disponível em $dateStr'),
          ],
        ),
        backgroundColor: const Color(0xFF1B4D3E),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
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

          final needsPassword = !widget.isPreview && meta.hasPassword && !_authorized;
          final asyncDays =
              needsPassword ? null : ref.watch(sharedCalendarDaysProvider(widget.calendarId));

          final themeConfig = ThemeManager.getTheme(meta.calendar.themeId);

          Widget mainContent = Stack(
            children: [
              if (themeConfig.buildFloatingComponent(context) != null)
                Positioned.fill(child: themeConfig.buildFloatingComponent(context)!),
              CustomScrollView(
                slivers: [
                  SliverAppBar(
                    backgroundColor: themeConfig.buildHeaderComponent(context) != null ? Colors.transparent : themeConfig.scaffoldBackgroundColor(context),
                    elevation: 0,
                    pinned: true,
                    centerTitle: true,
                    expandedHeight: themeConfig.buildHeaderComponent(context) != null ? 120 : null,
                    flexibleSpace: themeConfig.buildHeaderComponent(context),
                    leading: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: IconButton(
                        onPressed: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/');
                          }
                        },
                        icon: Icon(Icons.arrow_back, color: themeConfig.primaryColor),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: const CircleBorder(),
                        ),
                      ),
                    ),
                    actions: [
                      Consumer(
                        builder: (context, ref, child) {
                          final isLikedAsync = ref.watch(isLikedProvider(widget.calendarId));
                          return IconButton(
                            onPressed: () async {
                              final auth = ref.read(authControllerProvider);
                              final userId = auth.user?.id;
                              if (userId == null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Faça login para curtir este calendário!')),
                                );
                                return;
                              }
                              try {
                                await ref.read(viewerRepositoryProvider).toggleLike(widget.calendarId, userId);
                                ref.invalidate(isLikedProvider(widget.calendarId));
                                ref.invalidate(sharedCalendarMetadataProvider(widget.calendarId));
                              } catch (e) {
                                if (!context.mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Erro ao registrar curtida.')),
                                );
                              }
                            },
                            icon: Icon(
                              isLikedAsync.maybeWhen(data: (liked) => liked ? Icons.favorite : Icons.favorite_outline, orElse: () => Icons.favorite_outline),
                              color: isLikedAsync.maybeWhen(data: (liked) => liked ? Colors.red : themeConfig.primaryColor, orElse: () => themeConfig.primaryColor),
                            ),
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.white,
                              shape: const CircleBorder(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        onPressed: () => SharePlus.instance.share(
                          ShareParams(text: FrestaUrls.calendarShareUrl(widget.calendarId)),
                        ),
                        icon: Icon(LucideIcons.share, color: themeConfig.primaryColor),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: const CircleBorder(),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                  ),
                  
                  // ---- Fresta Ad Banner for free calendars (Header) ----
                  if (!meta.calendar.isPremium)
                    const SliverToBoxAdapter(
                      child: FrestaAdBanner(position: FrestaAdPosition.header),
                    ),

                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
                      child: Column(
                        children: [
                          if (themeConfig.id == 'namoro') ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(colors: themeConfig.headerGradient),
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: const Text(
                                'Amor e Romance',
                                style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],
                          Text(
                            meta.calendar.title,
                            textAlign: TextAlign.center,
                            style: themeConfig.titleStyle.copyWith(
                              color: themeConfig.titleColor(context),
                              fontSize: 36,
                            ),
                          ),
                          if (meta.calendar.headerMessage?.isNotEmpty == true || themeConfig.id == 'namoro') ...[
                            const SizedBox(height: 8),
                            Text(
                              meta.calendar.headerMessage?.isNotEmpty == true
                                  ? meta.calendar.headerMessage!
                                  : 'Uma jornada de amor para nós dois',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: themeConfig.textColor(context), fontSize: 20, fontWeight: FontWeight.w400),
                            ),
                            const SizedBox(height: 32),
                            if (themeConfig.id == 'namoro')
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '0% de puro amor',
                                    style: TextStyle(color: themeConfig.primaryColor, fontWeight: FontWeight.bold, fontSize: 12),
                                  ),
                                  const SizedBox(height: 8),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(999),
                                    child: LinearProgressIndicator(
                                      value: 0.1,
                                      backgroundColor: themeConfig.primaryColor.withValues(alpha: 0.1),
                                      valueColor: AlwaysStoppedAnimation<Color>(themeConfig.primaryColor),
                                      minHeight: 12,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                          const SizedBox(height: 24),
                          if (themeConfig.id != 'namoro')
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
                        ],
                      ),
                    ),
                  ),

                  if (needsPassword)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Container(
                          padding: const EdgeInsets.all(32),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(32),
                            boxShadow: const [
                              BoxShadow(color: Color(0x0C000000), blurRadius: 32, offset: Offset(0, 12)),
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
                                style: TextStyle(color: Color(0xFF1B4D3E), fontWeight: FontWeight.w800, fontSize: 20, letterSpacing: -0.5),
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
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 1.5)),
                                  suffixIcon: IconButton(
                                    onPressed: () => setState(() => _showPassword = !_showPassword),
                                    icon: Icon(_showPassword ? LucideIcons.eyeOff : LucideIcons.eye, color: const Color(0xFF9CA3AF)),
                                  ),
                                ),
                              ),
                              if (_passwordError != null) ...[
                                const SizedBox(height: 16),
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFFCA5A5))),
                                  child: Row(
                                    children: [
                                      const Icon(LucideIcons.circleAlert, size: 20, color: Color(0xFFDC2626)),
                                      const SizedBox(width: 8),
                                      Text(_passwordError!, style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13, fontWeight: FontWeight.w600)),
                                    ],
                                  ),
                                ),
                              ],
                              const SizedBox(height: 32),
                              FilledButton(
                                onPressed: _verifying ? null : _verifyPassword,
                                style: FilledButton.styleFrom(backgroundColor: const Color(0xFF1B4D3E), padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                                child: _verifying
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                    : const Text('Desbloquear Calendário', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  else if (asyncDays != null)
                    ...asyncDays.when(
                      data: (days) {
                        return [
                          SliverPadding(
                            padding: const EdgeInsets.fromLTRB(24, 0, 24, 48),
                            sliver: SliverGrid(
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 0.75,
                              ),
                              delegate: SliverChildBuilderDelegate(
                                (context, index) {
                                  final day = days[index];
                                  final locked = _isDayLocked(meta.calendar.createdAt, day.day);
                                  
                                  return Container(
                                    decoration: themeConfig.cardDecoration(context),
                                    child: Material(
                                      color: Colors.transparent,
                                      child: InkWell(
                                        borderRadius: BorderRadius.circular(24),
                                        onTap: () {
                                          if (locked) {
                                            _showLockedMessage(_getAvailableDate(meta.calendar.createdAt, day.day));
                                            return;
                                          }
                                          if (themeConfig.id == 'namoro' || themeConfig.id == 'casamento' || themeConfig.id == 'bodas' || themeConfig.id == 'noivado' || themeConfig.id == 'aniversario' || themeConfig.id == 'natal' || themeConfig.id == 'viagem') {
                                              // Currently using NotebookModalContent for all themes that have specific UI, until a generic one is built or they are unified.
                                              // The generic modal can use themeConfig properties.
                                              showModalBottomSheet(
                                                context: context,
                                                backgroundColor: Colors.transparent,
                                                isScrollControlled: true,
                                                builder: (context) => NotebookModalContent(
                                                  title: 'Dia ${day.day}',
                                                  content: (day.message ?? '').trim().isEmpty 
                                                      ? 'Espere por esse momento especial...' 
                                                      : day.message!,
                                                ),
                                              );
                                            } else {
                                            final url = (day.url ?? '').trim();
                                            if (url.isNotEmpty) {
                                              final uri = Uri.tryParse(url);
                                              if (uri != null) launchUrl(uri, mode: LaunchMode.externalApplication);
                                            }
                                          }
                                        },
                                        child: Padding(
                                          padding: const EdgeInsets.all(12),
                                          child: Stack(
                                            children: [
                                              if (locked)
                                                const Positioned(top: 0, right: 0, child: Icon(LucideIcons.lock, size: 16, color: Color(0xFFD1D5DB))),
                                              Column(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    'Dia ${day.day}',
                                                    style: themeConfig.titleStyle.copyWith(fontSize: 24, color: themeConfig.primaryColor),
                                                  ),
                                                  const SizedBox(height: 16),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                                    decoration: BoxDecoration(
                                                      color: Colors.grey.shade50,
                                                      borderRadius: BorderRadius.circular(999),
                                                      border: Border.all(color: Colors.grey.shade200),
                                                    ),
                                                    child: Row(
                                                      mainAxisSize: MainAxisSize.min,
                                                      children: [
                                                        Icon(Icons.visibility_outlined, size: 14, color: Colors.grey.shade600),
                                                        const SizedBox(width: 4),
                                                        Text('Já aberto', style: TextStyle(fontSize: 10, color: Colors.grey.shade600, fontWeight: FontWeight.bold)),
                                                      ],
                                                    ),
                                                  ),
                                                  const SizedBox(height: 16),
                                                  FilledButton(
                                                    onPressed: null,
                                                    style: FilledButton.styleFrom(
                                                      backgroundColor: themeConfig.primaryColor,
                                                      disabledBackgroundColor: themeConfig.primaryColor,
                                                      minimumSize: const Size.fromHeight(36),
                                                      padding: EdgeInsets.zero,
                                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                                    ),
                                                    child: const Text('VER NOVAMENTE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  );
                                },
                                childCount: days.length,
                              ),
                            ),
                          ),
                         ];
                       },
                       loading: () => const [SliverFillRemaining(child: Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F)))))] ,
                       error: (error, _) => [SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.all(24), child: Container(padding: const EdgeInsets.all(24), decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFFCA5A5))), child: Column(children: [const Icon(LucideIcons.triangleAlert, size: 32, color: Color(0xFFDC2626)), const SizedBox(height: 16), const Text('Erro ao carregar os dias', style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF991B1B), fontSize: 16)), const SizedBox(height: 16), FilledButton.icon(onPressed: () => ref.invalidate(sharedCalendarDaysProvider(widget.calendarId)), icon: const Icon(LucideIcons.refreshCw, size: 18), label: const Text('Tentar novamente', style: TextStyle(fontWeight: FontWeight.bold)), style: FilledButton.styleFrom(backgroundColor: const Color(0xFFDC2626), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))))]))))],
                     ),

                  // ---- Fresta Watermark for free calendars ----
                  if (!meta.calendar.isPremium)
                    const SliverToBoxAdapter(
                      child: FrestaWatermark(),
                    ),
                  
                  if (meta.calendar.footerMessage?.isNotEmpty == true || themeConfig.id == 'namoro')
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(32),
                              decoration: BoxDecoration(
                                color: Theme.of(context).brightness == Brightness.dark 
                                    ? Theme.of(context).colorScheme.surface 
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: themeConfig.primaryColor.withValues(alpha: 0.1)),
                                boxShadow: [
                                  BoxShadow(color: themeConfig.primaryColor.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, 10)),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Icon(LucideIcons.quote, size: 40, color: themeConfig.primaryColor),
                                  const SizedBox(height: 16),
                                  Text(
                                    'MENSAGEM DE ENCERRAMENTO',
                                    style: TextStyle(color: themeConfig.primaryColor, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    meta.calendar.footerMessage?.isNotEmpty == true
                                        ? meta.calendar.footerMessage!
                                        : '"CADA DIA AO SEU LADO É UM NOVO CAPÍTULO DA NOSSA HISTÓRIA DE AMOR. ❤️"',
                                    textAlign: TextAlign.center,
                                    style: themeConfig.titleStyle.copyWith(fontSize: 20, color: themeConfig.primaryColor),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 32),
                            FilledButton.icon(
                              onPressed: () => context.go('/'),
                              icon: const Icon(Icons.auto_awesome),
                              label: const Text('Criar meu calendário', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              style: FilledButton.styleFrom(
                                backgroundColor: themeConfig.primaryColor,
                                minimumSize: const Size.fromHeight(56),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
              // Preview Mode Banner
              if (widget.isPreview)
                Positioned(
                  bottom: 24,
                  left: 24,
                  right: 24,
                  child: SafeArea(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.85),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 8)),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(LucideIcons.eye, color: Colors.white, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Modo Visualização',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                                letterSpacing: -0.3,
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () => context.pop(),
                            style: TextButton.styleFrom(
                              backgroundColor: Colors.white.withValues(alpha: 0.15),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            child: const Text('Voltar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          );

          return themeConfig.buildBackground(context, mainContent);
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
