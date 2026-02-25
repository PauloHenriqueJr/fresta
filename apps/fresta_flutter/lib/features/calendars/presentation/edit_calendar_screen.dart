import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';

class EditCalendarScreen extends ConsumerStatefulWidget {
  const EditCalendarScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  ConsumerState<EditCalendarScreen> createState() => _EditCalendarScreenState();
}

class _EditCalendarScreenState extends ConsumerState<EditCalendarScreen> {
  late final TextEditingController _titleController;
  late final TextEditingController _themeController;
  late final TextEditingController _passwordController;

  bool _hydrated = false;
  bool _saving = false;
  bool _clearPassword = false;
  bool _showPassword = false;
  String _privacy = 'private';
  String _status = 'rascunho';
  String? _error;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _themeController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _themeController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _hydrateIfNeeded() {
    if (_hydrated) return;
    final asyncDetail = ref.read(ownerCalendarDetailProvider(widget.calendarId));
    final detail = asyncDetail.maybeWhen(data: (d) => d, orElse: () => null);
    if (detail == null) return;

    _titleController.text = detail.calendar.title;
    _themeController.text = detail.calendar.themeId;
    _privacy = detail.calendar.privacy;
    _status = detail.calendar.status;
    _clearPassword = false;
    _hydrated = true;
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final passwordInput = _passwordController.text.trim();
      await ref.read(calendarsRepositoryProvider).updateCalendar(
            calendarId: widget.calendarId,
            title: _titleController.text.trim(),
            themeId: _themeController.text.trim(),
            privacy: _privacy,
            status: _status,
            password: _clearPassword ? null : (passwordInput.isEmpty ? null : passwordInput),
            clearPassword: _clearPassword,
          );

      ref.invalidate(ownerCalendarDetailProvider(widget.calendarId));
      ref.invalidate(myCalendarsProvider);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Calendário atualizado.')),
      );
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
    _hydrateIfNeeded();

    return Scaffold(
      appBar: AppBar(title: const Text('Editar calendário')),
      body: asyncDetail.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Erro: $error')),
        data: (detail) {
          if (detail == null) {
            return const Center(child: Text('Calendário não encontrado.'));
          }

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              TextField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Título'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _themeController,
                decoration: const InputDecoration(labelText: 'Tema (theme_id)'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _privacy,
                items: const [
                  DropdownMenuItem(value: 'private', child: Text('Privado')),
                  DropdownMenuItem(value: 'public', child: Text('Público')),
                ],
                onChanged: (value) {
                  if (value != null) setState(() => _privacy = value);
                },
                decoration: const InputDecoration(labelText: 'Privacidade'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _status,
                items: const [
                  DropdownMenuItem(value: 'rascunho', child: Text('Rascunho')),
                  DropdownMenuItem(value: 'ativo', child: Text('Ativo')),
                  DropdownMenuItem(value: 'finalizado', child: Text('Finalizado')),
                  DropdownMenuItem(
                    value: 'aguardando_pagamento',
                    child: Text('Aguardando pagamento'),
                  ),
                  DropdownMenuItem(value: 'inativo', child: Text('Inativo')),
                ],
                onChanged: (value) {
                  if (value != null) setState(() => _status = value);
                },
                decoration: const InputDecoration(labelText: 'Status'),
              ),
              const SizedBox(height: 16),
              Text(
                'Proteção por senha',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                detail.hasPassword
                    ? 'Este calendário já possui senha. Defina uma nova senha para substituir ou marque para remover.'
                    : 'Opcional. Defina uma senha para proteger o calendário.',
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                value: _clearPassword,
                onChanged: (value) => setState(() => _clearPassword = value),
                contentPadding: EdgeInsets.zero,
                title: const Text('Remover senha do calendário'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                enabled: !_clearPassword,
                obscureText: !_showPassword,
                decoration: InputDecoration(
                  labelText: detail.hasPassword ? 'Nova senha (opcional)' : 'Senha',
                  suffixIcon: IconButton(
                    onPressed: () => setState(() => _showPassword = !_showPassword),
                    icon: Icon(
                      _showPassword
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Se deixar o campo de senha vazio, a senha atual é mantida (a menos que "Remover senha" esteja ativo).',
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 20),
              FilledButton(
                onPressed: _saving ? null : _save,
                child: Text(_saving ? 'Salvando...' : 'Salvar alterações'),
              ),
            ],
          );
        },
      ),
    );
  }
}
