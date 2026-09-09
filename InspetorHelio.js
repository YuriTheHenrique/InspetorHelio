(() => {
    const ID = 'nexo-inverter-scanner';
    const BTN = 'nexo-inverter-inspect';
    const SIMPLE = 'nexo-inverter-simple';

    // Remove instâncias anteriores
    document.getElementById(ID)?.remove();
    document.getElementById(BTN)?.remove();
    document.getElementById(SIMPLE)?.remove();

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const clean = text => (text || '').replace(/\s+/g, ' ').trim();

    // Ícones SVG
    const icon = {
        search: `
            <svg viewBox="0 0 24 24" width="16" height="16"
                 fill="none" stroke="#fff" stroke-width="2"
                 stroke-linecap="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="m20 20-4-4"/>
            </svg>
        `,

        spin: `
            <svg viewBox="0 0 24 24" width="17" height="17"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round"
                 style="animation:nexoSpin .8s linear infinite">
                <circle cx="12" cy="12" r="9" stroke-dasharray="22 35"/>
            </svg>
        `,

        check: `
            <svg viewBox="0 0 24 24" width="17" height="17"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">
                <path d="m5 12 4 4L19 6"/>
            </svg>
        `,

        copy: `
            <svg viewBox="0 0 24 24" width="15" height="15"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">
                <rect x="8" y="8" width="12" height="12" rx="2"/>
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0-2-2"/>
            </svg>
        `,

        close: `
            <svg viewBox="0 0 24 24" width="16" height="16"
                 fill="none" stroke="#fff" stroke-width="2"
                 stroke-linecap="round">
                <path d="M6 6l12 12M18 6 6 18"/>
            </svg>
        `
    };

    // CSS do scanner
    const style = document.createElement('style');

    style.textContent = `
        @keyframes nexoSpin {
            to {
                transform: rotate(360deg);
            }
        }

        #${BTN},
        #${SIMPLE} {
            position: fixed;
            bottom: 20px;
            z-index: 2147483647;
            background: #08314A;
            color: #fff !important;
            border: 0;
            border-radius: 7px;
            padding: 9px 14px;
            display: flex;
            align-items: center;
            gap: 7px;
            font: 600 13px Arial, sans-serif;
            box-shadow: 0 5px 18px #0003;
            cursor: pointer;
        }

        #${BTN} {
            right: 176px;
        }

        #${SIMPLE} {
            right: 20px;
        }

        #${BTN} svg,
        #${SIMPLE} svg {
            color: #fff !important;
            stroke: #fff !important;
        }

        #${BTN} span,
        #${SIMPLE} span {
            color: #fff !important;
        }

        #${BTN}:hover,
        #${SIMPLE}:hover {
            filter: brightness(1.12);
        }

        #${ID} {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 440px;
            z-index: 2147483647;
            background: #fff;
            border: 1px solid #d8dde2;
            border-radius: 8px;
            box-shadow: 0 8px 30px #0003;
            font: 13px Arial, sans-serif;
            color: #20262b;
            overflow: hidden;
        }

        #${ID} .head {
            height: 42px;
            background: #08314A;
            color: #fff !important;
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 8px;
            font-weight: 600;
        }

        #${ID} .head span {
            color: #fff !important;
        }

        #${ID} .close {
            margin-left: auto;
            background: none;
            border: 0;
            color: #fff !important;
            cursor: pointer;
            padding: 4px;
            display: flex;
        }

        #${ID} .close svg {
            stroke: #fff !important;
        }

        #${ID} .status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 11px 13px;
            border-bottom: 1px solid #e5e7e9;
        }

        #${ID} .pending {
            display: none;
            padding: 8px 13px;
            border-bottom: 1px solid #e5e7e9;
            background: #fafbfc;
            max-height: 120px;
            overflow: auto;
            font: 12px Consolas, monospace;
            color: #4b555c;
        }

        #${ID} .pending .item {
            padding: 2px 0;
        }

        #${ID} .result {
            padding: 10px 12px;
        }

        #${ID} textarea {
            width: 100%;
            height: 170px;
            box-sizing: border-box;
            resize: vertical;
            border: 1px solid #d5dadd;
            border-radius: 5px;
            padding: 9px;
            font: 12px Consolas, monospace;
            outline: none;
        }

        #${ID} .actions {
            display: flex;
            justify-content: flex-end;
            gap: 7px;
            margin-top: 8px;
        }

        #${ID} .actions button {
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #cdd3d7;
            background: #fff;
            border-radius: 5px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 12px;
        }

        #${ID} .actions button:hover {
            background: #f4f6f7;
        }
    `;

    document.head.appendChild(style);

    // Botão "Inspecionar"
    const button = document.createElement('button');

    button.id = BTN;
    button.innerHTML = `
        ${icon.search}
        <span>Inspecionar</span>
    `;

    // Botão "Coleta simples"
    const simple = document.createElement('button');

    simple.id = SIMPLE;
    simple.innerHTML = `
        ${icon.search}
        <span>Coleta simples</span>
    `;

    document.body.append(button, simple);

    // ============================================================
    // LOCALIZAÇÃO DOS INVERSORES
    // ============================================================

    function snapshot() {
        return [...document.querySelectorAll('.element-display')]
            .flatMap(group => {
                const grupo = clean(
                    group.querySelector('.element-display-header')?.textContent || ''
                );

                return [...group.querySelectorAll('.its-info > .horizontal-bar')]
                    .map(element => {
                        const title = element.getAttribute('title') || '';
                        const match = title.match(/^(\S+)\s*-/);

                        return match
                            ? {
                                grupo,
                                id: match[1]
                            }
                            : null;
                    })
                    .filter(Boolean);
            })
            .sort((a, b) =>
                a.id.localeCompare(
                    b.id,
                    undefined,
                    { numeric: true }
                )
            );
    }

    // Localiza um inversor específico na página
    function getCurrent(grupo, id) {
        const group = [...document.querySelectorAll('.element-display')]
            .find(element =>
                clean(
                    element.querySelector('.element-display-header')?.textContent || ''
                ) === grupo
            );

        if (!group) {
            return null;
        }

        return [...group.querySelectorAll('.its-info > .horizontal-bar')]
            .find(element =>
                (element.getAttribute('title') || '')
                    .startsWith(id + ' - ')
            );
    }

    // ============================================================
    // LEITURA DOS DADOS DO INVERSOR
    // ============================================================

    function info(element) {
        if (!element) {
            return null;
        }

        const title = element.getAttribute('title') || '';

        const idMatch = title.match(/^(\S+)\s*-/);

        if (!idMatch) {
            return null;
        }

        const powerMatch = title.match(
            /P\s*:\s*(-?\d+(?:[.,]\d+)?)/
        );

        const fills = [...element.querySelectorAll('svg,[fill]')]
            .map(element =>
                (element.getAttribute('fill') || '').toLowerCase()
            );

        return {
            id: idMatch[1],

            p: powerMatch
                ? parseFloat(
                    powerMatch[1].replace(',', '.')
                )
                : null,

            comunicacao:
                /COMMS\s*(?:255|2565)/i.test(title) ||
                fills.includes('#f3c300'),

            falha:
                fills.includes('#ff0000')
        };
    }

    // ============================================================
    // LEITURA DOS AVISOS DO INVERSOR
    // ============================================================

    function warning() {
        const panel = document.querySelector(
            '#selected-element-content'
        );

        if (!panel) {
            return null;
        }

        const warnings = panel.querySelector('.warnings');

        if (!warnings) {
            return 'No warnings';
        }

        const texto = [...warnings.children]
            .map(element => clean(element.textContent))
            .filter(Boolean)
            .join(' ');

        return (
            texto ||
            clean(warnings.textContent) ||
            'No warnings'
        );
    }

    // ============================================================
    // AGUARDA UMA CONDIÇÃO
    // ============================================================

    async function waitFor(
        fn,
        timeout = 800,
        interval = 30
    ) {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            const value = fn();

            if (value) {
                return value;
            }

            await sleep(interval);
        }

        return null;
    }

    // ============================================================
    // ABRE O INVERSOR E LÊ OS AVISOS
    // ============================================================

    async function abrirEler(inv) {
        const element = getCurrent(
            inv.grupo,
            inv.id
        );

        if (!element) {
            return null;
        }

        element.click();

        const panel = await waitFor(
            () => document.querySelector('#selected-element-content'),
            800,
            30
        );

        if (!panel) {
            return null;
        }

        const motivo = warning();

        document
            .querySelector('#selected-element-header button')
            ?.click();

        await waitFor(
            () => !document.querySelector('#selected-element-content'),
            500,
            30
        );

        return motivo;
    }

    // ============================================================
    // CONFIRMAÇÃO DE FALHA DE COMUNICAÇÃO
    // ============================================================

    async function confirmarComunicacao(inv) {
        await sleep(1000);

        return info(
            getCurrent(
                inv.grupo,
                inv.id
            )
        );
    }

    // ============================================================
    // EXECUÇÃO PRINCIPAL
    // ============================================================

    async function iniciar(modo) {
        button.remove();
        simple.remove();

        // Cria o painel
        const box = document.createElement('div');

        box.id = ID;

        box.innerHTML = `
            <div class="head">
                ${icon.search}

                <span>
                    Scanner de Inversores ·
                    ${modo === 'simples' ? 'Coleta simples' : 'Completo'}
                </span>

                <button class="close" title="Fechar">
                    ${icon.close}
                </button>
            </div>

            <div class="status">
                <span class="status-icon">
                    ${icon.spin}
                </span>

                <span class="status-text">
                    Iniciando...
                </span>
            </div>

            <div class="pending"></div>

            <div
                class="result"
                style="display:none"
            >
                <textarea readonly></textarea>

                <div class="actions">
                    <button class="copy">
                        ${icon.copy}
                        <span>Copiar</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(box);

        const status = box.querySelector('.status-text');
        const pending = box.querySelector('.pending');
        const result = box.querySelector('.result');
        const textarea = box.querySelector('textarea');

        // Botão fechar
        box.querySelector('.close').onclick = () => {
            box.remove();
            document.body.append(button, simple);
        };

        try {
            const inversores = snapshot();
            const resultado = [];
            const pendentes = [];

            status.textContent =
                `Verificando 0/${inversores.length}`;

            // ====================================================
            // PRIMEIRA PASSAGEM
            // ====================================================

            for (let i = 0; i < inversores.length; i++) {
                const inv = inversores[i];

                status.textContent =
                    `Verificando ${i + 1}/${inversores.length} · ${inv.id}`;

                const data = info(
                    getCurrent(
                        inv.grupo,
                        inv.id
                    )
                );

                // -----------------------------------------------
                // Falha de comunicação
                // -----------------------------------------------

                if (data?.comunicacao) {
                    pendentes.push({
                        inv,
                        promise: confirmarComunicacao(inv)
                    });

                    pending.style.display = 'block';

                    pending.innerHTML = pendentes
                        .map(item => `
                            <div class="item">
                                - ${item.inv.id}
                                Falha de comunicação ·
                                aguardando confirmação
                            </div>
                        `)
                        .join('');
                }

                // -----------------------------------------------
                // Inversor encontrado
                // -----------------------------------------------

                else if (data) {

                    // ============================================
                    // MODO COMPLETO
                    // ============================================

                    if (modo === 'completo') {

                        // Falha
                        if (data.falha) {
                            const motivo = await abrirEler(inv);

                            if (motivo) {
                                resultado.push(
                                    `- ${inv.id} ${motivo}`
                                );
                            }
                        }

                        // Potência zero ou desconhecida
                        else if (
                            data.p === 0 ||
                            data.p === null
                        ) {
                            const motivo = await abrirEler(inv);

                            if (motivo) {
                                resultado.push(
                                    `- ${inv.id} ${motivo}`
                                );
                            }
                        }
                    }

                    // ============================================
                    // MODO SIMPLES
                    // ============================================

                    else if (
                        data.p === 0 ||
                        data.p === null
                    ) {
                        const motivo = await abrirEler(inv);

                        if (motivo) {
                            resultado.push(
                                `- ${inv.id} ${motivo}`
                            );
                        }
                    }
                }

                if (i < inversores.length - 1) {
                    await sleep(40);
                }
            }

            // ====================================================
            // SEGUNDA PASSAGEM
            // Confirmação das falhas de comunicação
            // ====================================================

            if (pendentes.length) {

                status.textContent =
                    `Verificando ${inversores.length}/${inversores.length} · confirmando comunicação`;

                for (const item of pendentes) {

                    const data = await item.promise;

                    pending.innerHTML = pendentes
                        .filter(x => !x.done)
                        .map(x => `
                            <div class="item">
                                - ${x.inv.id}
                                Falha de comunicação ·
                                aguardando confirmação
                            </div>
                        `)
                        .join('');

                    item.done = true;

                    // Comunicação continua perdida
                    if (data?.comunicacao) {
                        resultado.push(
                            `- ${item.inv.id} Falha de comunicação`
                        );
                    }

                    // Comunicação voltou
                    else if (data) {

                        // ========================================
                        // MODO COMPLETO
                        // ========================================

                        if (modo === 'completo') {

                            if (data.falha) {
                                const motivo = await abrirEler(item.inv);

                                if (motivo) {
                                    resultado.push(
                                        `- ${item.inv.id} ${motivo}`
                                    );
                                }
                            }

                            else if (
                                data.p === 0 ||
                                data.p === null
                            ) {
                                const motivo = await abrirEler(item.inv);

                                if (motivo) {
                                    resultado.push(
                                        `- ${item.inv.id} ${motivo}`
                                    );
                                }
                            }
                        }

                        // ========================================
                        // MODO SIMPLES
                        // ========================================

                        else if (
                            data.p === 0 ||
                            data.p === null
                        ) {
                            const motivo = await abrirEler(item.inv);

                            if (motivo) {
                                resultado.push(
                                    `- ${item.inv.id} ${motivo}`
                                );
                            }
                        }
                    }
                }

                pending.style.display = 'none';
            }

            // ====================================================
            // RESULTADO FINAL
            // ====================================================

            window.__resultadoInversores = resultado;

            const texto = resultado.join('\n');

            textarea.value = texto;

            result.style.display = 'block';

            box.querySelector('.status-icon').innerHTML =
                icon.check;

            status.textContent = resultado.length
                ? `Concluído · ${resultado.length} ocorrência${resultado.length === 1 ? '' : 's'}`
                : 'Concluído · Nenhuma ocorrência';

            // Copia automaticamente
            try {
                await navigator.clipboard.writeText(texto);
            } catch {}

            // ====================================================
            // BOTÃO COPIAR
            // ====================================================

            box.querySelector('.copy').onclick = async () => {
                try {
                    await navigator.clipboard.writeText(texto);

                    box.querySelector('.copy').innerHTML = `
                        ${icon.check}
                        <span>Copiado</span>
                    `;

                    setTimeout(() => {
                        if (box.isConnected) {
                            box.querySelector('.copy').innerHTML = `
                                ${icon.copy}
                                <span>Copiar</span>
                            `;
                        }
                    }, 1500);

                } catch {
                    textarea.select();
                }
            };

        } catch (error) {
            status.textContent =
                'Erro durante a varredura';

            console.error(error);
        }
    }

    // ============================================================
    // EVENTOS DOS BOTÕES
    // ============================================================

    button.onclick = () => iniciar('completo');

    simple.onclick = () => iniciar('simples');

})();
