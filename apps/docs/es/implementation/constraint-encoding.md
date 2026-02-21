# Codificación de Restricciones (v0.1)

La Codificación de Restricciones es el proceso formal de traducir una especificación de alto nivel de RIGOR a una **máquina de estados persistente verificable por máquina**. Este proceso asegura que cada transición y modificación de contexto sea explícitamente declarada y estructuralmente sólida.

## 1. Jerarquía de Nodos de Especificación

La raíz de la especificación codifica todo el dominio de intención a través de los nodos `processes` y `events`:

```yaml
# 1. Dominio de Intención (Raíz)
processes:
  # 2. Especificación de Proceso
  OrderPaymentProcess:
    # 3. Modo de Persistencia
    persistence: true
    # 4. Comando de Inicio
    start_command: StartPayment
    # 5. Modelo de Datos (Contexto)
    context:
      order_id: uuid
      amount: integer
    # 6. Estado Inicial
    initial_state: INITIAL
    # 7. Máquina de Estados (Estados y Transiciones)
    states:
      INITIAL:
        emit_command: RequestPayment
        on:
          PaymentApproved:
            transition_to: COMPLETED
```

## 2. Codificación del Contexto Persistente

El bloque `context` codifica la única fuente de estado mutable para el proceso. Cada campo es fuertemente tipificado para habilitar validación determinística.

### 2.1 Mapeo de Tipos Primitivos
Un motor compatible con RIGOR debe mapear los tipos de especificación a sus equivalentes del entorno objetivo:
- `uuid` → UUID (RFC 4122).
- `string` → UTF-8 string.
- `integer` → Int64 (entero signed de 64 bits).
- `boolean` → Booleano (`true`/`false`).
- `datetime` → Marca de tiempo UTC ISO 8601.

### 2.2 Codificación de Nullable
El sufijo `?` (ej., `string?`) codifica nulabilidad explícita. Un campo sin `?` debe ser inicializado durante el `start_command` o resultará en un error de validación.

## 3. Codificación de la Maquina de Estados

Cada estado codifica exactamente un efecto, creando una estructura mutuamente excluyente:

### 3.1 Efectos Asíncronos (`emit_command`)
Codifica un comando que será despachado a un sistema externo. La codificación es **no bloqueante** y **fire-and-forget**.

### 3.2 Efectos Síncronos (`invoke`)
Codifica una llamada a un componente técnico interno. La codificación es **síncrona** y requiere una respuesta de evento inmediata.

### 3.3 Estados Terminales (`terminal: true`)
Codifica la conclusión del proceso. No se pueden codificar más transiciones para este estado.

## 4. Codificación de Lógica de Transición (`on:`)

El bloque `on:` codifica la reacción del proceso a eventos externos o internos.

### 4.1 Transición de Estado
Codifica el salto del estado actual al estado `transition_to`. Este salto es atómico e irreversible.

### 4.2 Modificación de Contexto (`update_context`)
Codifica las transformaciones al contexto persistente:
- `now` → Marca de tiempo actual del sistema.
- `increment` → Valor actual + 1.
- `event.payload.<field>` → Copiar valor de datos del evento.

## 5. Verificación de Maquina

La codificación se verifica en tres niveles:
1. **Nivel de Schema**: Estructura YAML correcta y nombres de claves.
2. **Nivel Estructural**: Todas las referencias de estado y evento existen y forman un grafo completo.
3. **Nivel Semántico**: Los tipos en `update_context` coinciden con la definición de `context`.

Cualquier fallo en la codificación resulta en una **especificación corrupta** que no puede ser implementada o ejecutada.
