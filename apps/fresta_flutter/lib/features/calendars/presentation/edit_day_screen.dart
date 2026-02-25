import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';

class EditDayScreen extends ConsumerStatefulWidget {
  const EditDayScreen({super.key, required this.calendarId, required this.day});

  final String calendarId;
  final int day;

  @override
  ConsumerState<EditDayScreen> createState() => _EditDayScreenState();
}

class _EditDayScreenState extends ConsumerState<EditDayScreen> {
  late final TextEditingController _messageController;
  late final TextEditingController _urlController;
  late final TextEditingController _labelController;
  String? _contentType;
  bool _initialized = false;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _messageController = TextEditingController();
    _urlController = TextEditingController();
    _labelController = TextEditingController();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _urlController.dispose();
    _labelController.dispose();
    super.dispose();
  }

  void _maybeHydrate() {
    if (_initialized) return;
    final asyncValue = ref.read(ownerCalendarDetailProvider(widget.calendarId));
    final detail = asyncValue.maybeWhen(
      data: (data) => data,
      orElse: () => null,
    );
    final day = detail?.days.where((d) => d.day == widget.day).firstOrNull;
    if (day == null) return;

    _messageController.text = day.message ?? '';
    _urlController.text = day.url ?? '';
    _labelController.text = day.label ?? '';
    _contentType = day.contentType;
    _initialized = true;
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      await ref.read(calendarsRepositoryProvider).updateDay(
            calendarId: widget.calendarId,
            day: widget.day,
            contentType: _contentType,
            message: _messageController.text.trim().isEmpty
                ? null
                : _messageController.text.trim(),
            url: _urlController.text.trim().isEmpty ? null : _urlController.text.trim(),
            label: _labelController.text.trim().isEmpty ? null : _labelController.text.trim(),
          );
      ref.invalidate(ownerCalendarDetailProvider(widget.calendarId));
      if (!mounted) return;
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(widget.calendarId));
    _maybeHydrate();

    return Scaffold(
      appBar: AppBar(title: Text('Editar Dia ${widget.day}')),
      body: asyncDetail.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Erro: $error')),
        data: (detail) {
          if (detail == null) return const Center(child: Text('Calendário não encontrado'));

          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBF5),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF0E6D8)),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Conteúdo do dia', style: TextStyle(fontWeight: FontWeight.w700)),
                    SizedBox(height: 6),
                    Text('Você pode salvar texto, link, rótulo e tipo de conteúdo para esse dia.'),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String?>(
                initialValue: _contentType,
                items: const [
                  DropdownMenuItem<String?>(value: null, child: Text('Sem tipo')),
                  DropdownMenuItem<String?>(value: 'text', child: Text('Texto')),
                  DropdownMenuItem<String?>(value: 'photo', child: Text('Foto')),
                  DropdownMenuItem<String?>(value: 'gif', child: Text('GIF')),
                  DropdownMenuItem<String?>(value: 'link', child: Text('Link')),
                  DropdownMenuItem<String?>(value: 'music', child: Text('Música')),
                ],
                onChanged: (value) => setState(() => _contentType = value),
                decoration: const InputDecoration(
                  labelText: 'Tipo de conteúdo',
                  prefixIcon: Icon(Icons.category_outlined),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _messageController,
                minLines: 3,
                maxLines: 6,
                decoration: const InputDecoration(
                  labelText: 'Mensagem',
                  prefixIcon: Icon(Icons.notes_rounded),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _urlController,
                decoration: const InputDecoration(
                  labelText: 'URL',
                  prefixIcon: Icon(Icons.link_rounded),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _labelController,
                decoration: const InputDecoration(
                  labelText: 'Rótulo (opcional)',
                  prefixIcon: Icon(Icons.label_outline_rounded),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFECEA),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    _error!,
                    style: const TextStyle(color: Color(0xFFB33B2E), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: _saving ? null : _save,
                icon: const Icon(Icons.check_rounded),
                label: Text(_saving ? 'Salvando...' : 'Salvar dia'),
              ),
            ],
          );
        },
      ),
    );
  }
}

extension IterableFirstOrNull<T> on Iterable<T> {
  T? get firstOrNull => isEmpty ? null : first;
}
