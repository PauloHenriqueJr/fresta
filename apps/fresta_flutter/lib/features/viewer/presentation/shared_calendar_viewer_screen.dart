import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/utils/fresta_urls.dart';
import '../application/viewer_providers.dart';
import '../../../data/repositories/viewer_repository.dart';

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
        if (!ok) _passwordError = 'Senha inválida';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _passwordError = e.toString());
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendário compartilhado'),
        actions: [
          IconButton(
            onPressed: () => SharePlus.instance.share(
              ShareParams(text: FrestaUrls.calendarShareUrl(widget.calendarId)),
            ),
            icon: const Icon(Icons.share),
          ),
          IconButton(
            onPressed: _openInBrowser,
            icon: const Icon(Icons.open_in_browser),
          ),
        ],
      ),
      body: asyncMeta.when(
        data: (meta) {
          if (meta == null) {
            return const Center(child: Text('Calendário não encontrado.'));
          }

          final needsPassword = meta.hasPassword && !_authorized;
          final asyncDays =
              needsPassword ? null : ref.watch(sharedCalendarDaysProvider(widget.calendarId));

          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  meta.calendar.title,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    Chip(label: Text('Tema: ${meta.calendar.themeId}')),
                    Chip(label: Text('Duração: ${meta.calendar.duration} dias')),
                    Chip(label: Text('Privacidade: ${meta.calendar.privacy}')),
                    if (meta.hasPassword) const Chip(label: Text('Protegido por senha')),
                  ],
                ),
                const SizedBox(height: 16),
                if (needsPassword) ...[
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Este calendário está protegido por senha.'),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _passwordController,
                            obscureText: !_showPassword,
                            onSubmitted: (_) {
                              if (!_verifying) {
                                _verifyPassword();
                              }
                            },
                            decoration: InputDecoration(
                              labelText: 'Senha do calendário',
                              suffixIcon: IconButton(
                                onPressed: () =>
                                    setState(() => _showPassword = !_showPassword),
                                icon: Icon(
                                  _showPassword
                                      ? Icons.visibility_off_outlined
                                      : Icons.visibility_outlined,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          FilledButton(
                            onPressed: _verifying ? null : _verifyPassword,
                            child: const Text('Desbloquear'),
                          ),
                          if (_passwordError != null) ...[
                            const SizedBox(height: 8),
                            Text(
                              _passwordError!,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ] else ...[
                  if (asyncDays != null)
                    ...asyncDays.when(
                      data: (days) {
                        if (days.isEmpty) {
                          return const [
                            Card(
                              child: ListTile(
                                title: Text('Sem dias cadastrados'),
                                subtitle: Text('Este calendário ainda não possui conteúdo.'),
                              ),
                            ),
                          ];
                        }

                        return [
                          for (final day in days)
                            Card(
                              child: ListTile(
                                title: Text('Dia ${day.day}'),
                                subtitle: Text(
                                  [
                                    if ((day.message ?? '').trim().isNotEmpty)
                                      day.message!.trim(),
                                    if ((day.url ?? '').trim().isNotEmpty) day.url!.trim(),
                                  ].join('\n').ifEmpty('Sem conteúdo ainda'),
                                ),
                                isThreeLine: ((day.message ?? '').contains('\n')) ||
                                    ((day.url ?? '').trim().isNotEmpty),
                                trailing: day.contentType != null
                                    ? Chip(label: Text(day.contentType!))
                                    : null,
                                onTap: ((day.url ?? '').trim().isEmpty)
                                    ? null
                                    : () async {
                                        final uri = Uri.tryParse(day.url!.trim());
                                        if (uri == null) return;
                                        await launchUrl(
                                          uri,
                                          mode: LaunchMode.externalApplication,
                                        );
                                      },
                              ),
                            ),
                        ];
                      },
                      loading: () => const [
                        Padding(
                          padding: EdgeInsets.symmetric(vertical: 20),
                          child: Center(child: CircularProgressIndicator()),
                        ),
                      ],
                      error: (error, _) => [
                        Card(
                          child: ListTile(
                            title: const Text('Erro ao carregar dias'),
                            subtitle: Text(error.toString()),
                            trailing: IconButton(
                              onPressed: () =>
                                  ref.invalidate(sharedCalendarDaysProvider(widget.calendarId)),
                              icon: const Icon(Icons.refresh),
                            ),
                          ),
                        ),
                      ],
                    ),
                ],
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: () => context.go('/auth/login'),
                  icon: const Icon(Icons.login),
                  label: const Text('Entrar para criar o seu calendário'),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Erro ao carregar calendário: $error'),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: () =>
                      ref.invalidate(sharedCalendarMetadataProvider(widget.calendarId)),
                  child: const Text('Tentar novamente'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

extension on String {
  String ifEmpty(String fallback) => trim().isEmpty ? fallback : this;
}
