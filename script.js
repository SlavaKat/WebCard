// Основной объект конструктора открыток
class CardConstructor {
    constructor() {
        this.project = {
            name: 'Новая открытка',
            description: '',
            pages: [],
            theme: 'classic',
            background: null,
            settings: {},
            version: '1.0.0'
        };
        
        this.state = {
            currentPage: 0,
            selectedElement: null,
            clipboard: null,
            history: [],
            historyIndex: -1,
            isEditing: false,
            isDragging: false,
            dragElement: null,
            dropZone: null
        };
        
        this.elements = {};
        this.modals = {};
        this.notifications = [];
        
        this.init();
    }
    
    // Инициализация
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupResizeObserver();
        this.createDefaultProject();
        this.setupHotkeys();
        this.hideLoader();
        
        console.log('%c🎨 Конструктор открыток загружен! 🎨', 'color: #ff6b6b; font-size: 18px; font-weight: bold;');
    }
    
    // Кэширование элементов DOM
    cacheElements() {
        this.elements = {
            // Главные элементы
            body: document.body,
            cardCanvas: document.getElementById('cardCanvas'),
            page1Content: document.getElementById('page1Content'),
            
            // Панели
            elementsPanel: document.getElementById('elementsPanel'),
            propertiesPanel: document.getElementById('propertiesPanel'),
            elementsToggle: document.getElementById('elementsToggle'),
            propertiesToggle: document.getElementById('propertiesToggle'),
            
            // Элементы
            categories: document.querySelectorAll('.category'),
            elementItems: document.querySelectorAll('.element-item'),
            elementsCategories: document.querySelectorAll('.elements-category'),
            
            // Свойства
            propTabs: document.querySelectorAll('.prop-tab'),
            propertiesSections: document.querySelectorAll('.properties-section'),
            applyPropsBtn: document.getElementById('applyPropsBtn'),
            resetPropsBtn: document.getElementById('resetPropsBtn'),
            copyElementBtn: document.getElementById('copyElementBtn'),
            
            // Модальные окна
            modalOverlay: document.getElementById('modalOverlay'),
            modals: document.querySelectorAll('.modal'),
            modalCloses: document.querySelectorAll('.modal-close'),
            
            // Настройки фона
            bgSettingsModal: document.getElementById('bgSettingsModal'),
            bgSettingsBtn: document.getElementById('bgSettingsBtn'),
            applyBgBtn: document.getElementById('applyBgBtn'),
            cancelBgBtn: document.getElementById('cancelBgBtn'),
            bgOptions: document.querySelectorAll('.bg-option'),
            bgControls: document.querySelectorAll('.bg-control'),
            
            // Предпросмотр
            previewModal: document.getElementById('previewModal'),
            previewBtn: document.getElementById('previewBtn'),
            fullscreenPreviewBtn: document.getElementById('fullscreenPreviewBtn'),
            sharePreviewBtn: document.getElementById('sharePreviewBtn'),
            closePreviewBtn: document.getElementById('closePreviewBtn'),
            
            // Проекты
            projectModal: document.getElementById('projectModal'),
            saveProjectBtn: document.getElementById('saveProjectBtn'),
            loadProjectBtn: document.getElementById('loadProjectBtn'),
            projectTabs: document.querySelectorAll('.project-tab'),
            projectTabContents: document.querySelectorAll('.project-tab-content'),
            confirmProjectBtn: document.getElementById('confirmProjectBtn'),
            cancelProjectBtn: document.getElementById('cancelProjectBtn'),
            projectFileUpload: document.getElementById('projectFileUpload'),
            
            // Экспорт
            exportModal: document.getElementById('exportModal'),
            exportHtmlBtn: document.getElementById('exportHtmlBtn'),
            exportOptions: document.querySelectorAll('.export-option'),
            exportSettings: document.querySelectorAll('.export-setting'),
            exportCode: document.getElementById('exportCode'),
            copyExportBtn: document.getElementById('copyExportBtn'),
            downloadExportBtn: document.getElementById('downloadExportBtn'),
            closeExportBtn: document.getElementById('closeExportBtn'),
            
            // Помощь
            helpModal: document.getElementById('helpModal'),
            helpBtn: document.getElementById('helpBtn'),
            helpTabs: document.querySelectorAll('.help-tab'),
            helpTabContents: document.querySelectorAll('.help-tab-content'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            
            // Темы
            themeButtons: document.querySelectorAll('.theme-btn-toolbar'),
            
            // Уведомления
            notificationContainer: document.getElementById('notificationContainer'),
            
            // Контекстное меню
            contextMenu: document.getElementById('contextMenu'),
            
            // Загрузчик
            loaderOverlay: document.getElementById('loaderOverlay'),
            loaderBar: document.getElementById('loaderBar'),
            loaderText: document.getElementById('loaderText'),
            
            // Файлы
            fileUpload: document.getElementById('fileUpload'),
            imageUpload: document.getElementById('imageUpload')
        };
        
        // Инициализация модальных окон
        this.modals = {};
        document.querySelectorAll('.modal').forEach(modal => {
            this.modals[modal.id] = modal;
        });
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Переключение панелей
        this.elements.elementsToggle.addEventListener('click', () => this.togglePanel('elements'));
        this.elements.propertiesToggle.addEventListener('click', () => this.togglePanel('properties'));
        
        // Категории элементов
        this.elements.categories.forEach(category => {
            category.addEventListener('click', () => this.switchCategory(category));
        });
        
        // Элементы
        this.elements.elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e, item));
            item.addEventListener('click', (e) => this.handleElementClick(e, item));
        });
        
        // Холст
        this.elements.cardCanvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.cardCanvas.addEventListener('drop', (e) => this.handleDrop(e));
        this.elements.cardCanvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Свойства
        this.elements.propTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchPropertiesTab(tab));
        });
        
        this.elements.applyPropsBtn.addEventListener('click', () => this.applyProperties());
        this.elements.resetPropsBtn.addEventListener('click', () => this.resetProperties());
        this.elements.copyElementBtn.addEventListener('click', () => this.copyElement());
        
        // Модальные окна
        this.elements.modalCloses.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.elements.modalOverlay.addEventListener('click', () => this.closeAllModals());
        
        // Настройки фона
        this.elements.bgSettingsBtn.addEventListener('click', () => this.openModal('bgSettingsModal'));
        this.elements.applyBgBtn.addEventListener('click', () => this.applyBackground());
        this.elements.cancelBgBtn.addEventListener('click', () => this.closeModal('bgSettingsModal'));
        
        this.elements.bgOptions.forEach(option => {
            option.addEventListener('click', () => this.switchBackgroundType(option));
        });
        
        // Предпросмотр
        this.elements.previewBtn.addEventListener('click', () => this.showPreview());
        this.elements.fullscreenPreviewBtn.addEventListener('click', () => this.enterFullscreen());
        this.elements.sharePreviewBtn.addEventListener('click', () => this.shareProject());
        this.elements.closePreviewBtn.addEventListener('click', () => this.closeModal('previewModal'));
        
        // Проекты
        this.elements.saveProjectBtn.addEventListener('click', () => this.openSaveModal());
        this.elements.loadProjectBtn.addEventListener('click', () => this.openLoadModal());
        this.elements.projectTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchProjectTab(tab));
        });
        
        this.elements.confirmProjectBtn.addEventListener('click', () => this.handleProjectAction());
        this.elements.cancelProjectBtn.addEventListener('click', () => this.closeModal('projectModal'));
        this.elements.projectFileUpload.addEventListener('change', (e) => this.handleProjectUpload(e));
        
        // Экспорт
        this.elements.exportHtmlBtn.addEventListener('click', () => this.openExportModal());
        this.elements.exportOptions.forEach(option => {
            option.addEventListener('click', () => this.switchExportType(option));
        });
        
        this.elements.copyExportBtn.addEventListener('click', () => this.copyExportCode());
        this.elements.downloadExportBtn.addEventListener('click', () => this.downloadExport());
        this.elements.closeExportBtn.addEventListener('click', () => this.closeModal('exportModal'));
        
        // Помощь
        this.elements.helpBtn.addEventListener('click', () => this.openModal('helpModal'));
        this.elements.helpTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchHelpTab(tab));
        });
        
        this.elements.closeHelpBtn.addEventListener('click', () => this.closeModal('helpModal'));
        
        // Темы
        this.elements.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeTheme(btn.dataset.theme));
        });
        
        // Контекстное меню
        document.addEventListener('contextmenu', (e) => this.showContextMenu(e));
        document.addEventListener('click', () => this.hideContextMenu());
        
        // Кнопки управления элементами
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                this.editElement(e.target.closest('.default-element'));
            } else if (e.target.closest('.delete-btn')) {
                this.deleteElement(e.target.closest('.default-element'));
            } else if (e.target.closest('.style-btn')) {
                this.openStyleEditor(e.target.closest('.default-element'));
            } else if (e.target.closest('.animate-btn')) {
                this.animateElement(e.target.closest('.default-element'));
            }
        });
        
        // Редактирование текста
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('editable')) {
                this.saveElementContent(e.target);
            }
        }, true);
        
        // Сохранение по Enter
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('editable') && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
            }
        });
    }
    
    // Настройка Drag & Drop
    setupDragAndDrop() {
        // Делаем элементы холста перетаскиваемыми
        const pageContent = this.elements.page1Content;
        
        // Используем Sortable для перетаскивания элементов
        if (typeof Sortable !== 'undefined') {
            new Sortable(pageContent, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onStart: (evt) => {
                    this.state.isDragging = true;
                    this.state.dragElement = evt.item;
                },
                onEnd: (evt) => {
                    this.state.isDragging = false;
                    this.state.dragElement = null;
                    this.saveState();
                }
            });
        }
    }
    
    // Наблюдение за изменениями размеров
    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    this.handleResize(entry.target);
                }
            });
            
            observer.observe(this.elements.cardCanvas);
        }
    }
    
    // Горячие клавиши
    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + S - Сохранить
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveProject();
            }
            
            // Ctrl + Z - Отменить
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            }
            
            // Ctrl + Y - Вернуть
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
            
            // Delete - Удалить элемент
            if (e.key === 'Delete' && this.state.selectedElement) {
                e.preventDefault();
                this.deleteElement(this.state.selectedElement);
            }
            
            // Ctrl + C - Копировать
            if (e.ctrlKey && e.key === 'c' && this.state.selectedElement) {
                e.preventDefault();
                this.copyToClipboard(this.state.selectedElement);
            }
            
            // Ctrl + V - Вставить
            if (e.ctrlKey && e.key === 'v' && this.state.clipboard) {
                e.preventDefault();
                this.pasteFromClipboard();
            }
            
            // Escape - Отменить выделение
            if (e.key === 'Escape') {
                this.deselectElement();
            }
        });
    }
    
    // Создание проекта по умолчанию
    createDefaultProject() {
        this.project = {
            name: 'Открытка на день рождения',
            description: 'Создано в конструкторе открыток',
            pages: [
                {
                    id: 1,
                    title: 'Главная страница',
                    elements: [
                        {
                            id: 'defaultHeading',
                            type: 'heading',
                            content: 'С Днем Рождения!',
                            styles: {
                                fontFamily: "'Marck Script', cursive",
                                fontSize: '3rem',
                                color: '#ff6b6b',
                                textAlign: 'center',
                                margin: '0 0 20px 0'
                            },
                            position: { top: 50, left: 50 },
                            size: { width: 'auto', height: 'auto' }
                        },
                        {
                            id: 'defaultName',
                            type: 'subheading',
                            content: 'Дорогой Саня!',
                            styles: {
                                fontFamily: "'Marck Script', cursive",
                                fontSize: '2rem',
                                color: '#2c3e50',
                                textAlign: 'center',
                                margin: '0 0 30px 0'
                            },
                            position: { top: 150, left: 50 },
                            size: { width: 'auto', height: 'auto' }
                        },
                        {
                            id: 'defaultMessage',
                            type: 'paragraph',
                            content: 'Поздравляю тебя с днем рождения! 🎉\n\nЖелаю счастья, здоровья и исполнения всех желаний!',
                            styles: {
                                fontFamily: "'Roboto', sans-serif",
                                fontSize: '1.1rem',
                                color: '#7f8c8d',
                                lineHeight: '1.8',
                                padding: '20px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                            },
                            position: { top: 250, left: 50 },
                            size: { width: '90%', height: 'auto' }
                        },
                        {
                            id: 'defaultCake',
                            type: 'cake',
                            content: '',
                            styles: {},
                            position: { top: 450, left: 300 },
                            size: { width: 200, height: 160 }
                        }
                    ]
                }
            ],
            theme: 'classic',
            background: {
                type: 'gradient',
                value: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1)'
            },
            settings: {
                animationSpeed: 'normal',
                soundEnabled: true,
                autoSave: true
            },
            version: '1.0.0'
        };
        
        this.state.currentPage = 0;
        this.saveState();
    }
    
    // Обработка Drag & Drop
    handleDragStart(e, element) {
        const type = element.dataset.type;
        const title = element.dataset.title;
        
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: type,
            title: title
        }));
        
        e.dataTransfer.effectAllowed = 'copy';
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = this.elements.cardCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.createElement(data.type, x, y);
        } catch (error) {
            console.error('Ошибка при добавлении элемента:', error);
            this.showNotification('Не удалось добавить элемент', 'error');
        }
    }
    
    // Создание элемента
    createElement(type, x, y) {
        const elementId = 'element_' + Date.now();
        const page = this.project.pages[this.state.currentPage];
        
        let element;
        
        switch (type) {
            case 'heading':
                element = this.createHeading(elementId, x, y);
                break;
            case 'subheading':
                element = this.createSubheading(elementId, x, y);
                break;
            case 'paragraph':
                element = this.createParagraph(elementId, x, y);
                break;
            case 'image':
                element = this.createImage(elementId, x, y);
                break;
            case 'cake':
                element = this.createCake(elementId, x, y);
                break;
            case 'confetti':
                element = this.createConfetti(elementId, x, y);
                break;
            case 'quiz':
                element = this.createQuiz(elementId, x, y);
                break;
            case 'countdown':
                element = this.createCountdown(elementId, x, y);
                break;
            default:
                element = this.createText(elementId, x, y, type);
        }
        
        page.elements.push(element);
        this.renderElement(element);
        this.saveState();
        
        this.showNotification(`Элемент "${this.getElementTitle(type)}" добавлен`, 'success');
    }
    
    createHeading(id, x, y) {
        return {
            id: id,
            type: 'heading',
            content: 'Новый заголовок',
            styles: {
                fontFamily: "'Marck Script', cursive",
                fontSize: '2.5rem',
                color: '#ff6b6b',
                textAlign: 'center',
                fontWeight: 'bold'
            },
            position: { top: y, left: x },
            size: { width: 'auto', height: 'auto' }
        };
    }
    
    createSubheading(id, x, y) {
        return {
            id: id,
            type: 'subheading',
            content: 'Подзаголовок',
            styles: {
                fontFamily: "'Marck Script', cursive",
                fontSize: '1.8rem',
                color: '#2c3e50',
                textAlign: 'center'
            },
            position: { top: y, left: x },
            size: { width: 'auto', height: 'auto' }
        };
    }
    
    createParagraph(id, x, y) {
        return {
            id: id,
            type: 'paragraph',
            content: 'Введите ваш текст здесь...',
            styles: {
                fontFamily: "'Roboto', sans-serif",
                fontSize: '1rem',
                color: '#7f8c8d',
                lineHeight: '1.6',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px'
            },
            position: { top: y, left: x },
            size: { width: '300px', height: 'auto' }
        };
    }
    
    createImage(id, x, y) {
        return {
            id: id,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop',
            styles: {
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            position: { top: y, left: x },
            size: { width: '200px', height: '150px' }
        };
    }
    
    createCake(id, x, y) {
        return {
            id: id,
            type: 'cake',
            content: '',
            styles: {},
            position: { top: y, left: x },
            size: { width: '200px', height: '160px' }
        };
    }
    
    createConfetti(id, x, y) {
        return {
            id: id,
            type: 'confetti',
            content: '',
            styles: {},
            position: { top: y, left: x },
            size: { width: '100px', height: '100px' }
        };
    }
    
    createQuiz(id, x, y) {
        return {
            id: id,
            type: 'quiz',
            content: JSON.stringify({
                question: 'Новый вопрос?',
                options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
                correct: 0
            }),
            styles: {
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px'
            },
            position: { top: y, left: x },
            size: { width: '300px', height: 'auto' }
        };
    }
    
    createCountdown(id, x, y) {
        return {
            id: id,
            type: 'countdown',
            content: JSON.stringify({
                targetDate: '2025-12-05T00:00:00',
                title: 'До дня рождения:'
            }),
            styles: {
                padding: '20px',
                background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
            },
            position: { top: y, left: x },
            size: { width: '300px', height: 'auto' }
        };
    }
    
    createText(id, x, y, type) {
        return {
            id: id,
            type: type,
            content: 'Новый элемент',
            styles: {
                fontFamily: "'Roboto', sans-serif",
                fontSize: '1rem',
                color: '#2c3e50',
                padding: '10px'
            },
            position: { top: y, left: x },
            size: { width: '200px', height: 'auto' }
        };
    }
    
    // Рендер элемента
    renderElement(elementData) {
        const container = this.elements.page1Content;
        
        const elementDiv = document.createElement('div');
        elementDiv.className = 'default-element';
        elementDiv.id = elementData.id;
        elementDiv.style.position = 'absolute';
        elementDiv.style.top = elementData.position.top + 'px';
        elementDiv.style.left = elementData.position.left + 'px';
        elementDiv.style.width = elementData.size.width;
        elementDiv.style.height = elementData.size.height;
        
        // Применение стилей
        Object.keys(elementData.styles).forEach(key => {
            elementDiv.style[key] = elementData.styles[key];
        });
        
        // Содержимое
        let content;
        switch (elementData.type) {
            case 'heading':
                content = document.createElement('h1');
                content.className = 'editable';
                content.contentEditable = 'true';
                content.textContent = elementData.content;
                break;
                
            case 'subheading':
                content = document.createElement('h2');
                content.className = 'editable';
                content.contentEditable = 'true';
                content.textContent = elementData.content;
                break;
                
            case 'paragraph':
            case 'message':
                content = document.createElement('div');
                content.className = 'message editable';
                content.contentEditable = 'true';
                content.innerHTML = elementData.content.replace(/\n/g, '<br>');
                break;
                
            case 'image':
                content = document.createElement('img');
                content.src = elementData.content;
                content.style.width = '100%';
                content.style.height = '100%';
                content.style.objectFit = 'cover';
                break;
                
            case 'cake':
                content = this.createCakeHTML();
                break;
                
            case 'confetti':
                content = document.createElement('div');
                content.className = 'confetti-element';
                content.innerHTML = '<i class="fas fa-star"></i>';
                break;
                
            case 'quiz':
                content = this.createQuizHTML(elementData.content);
                break;
                
            case 'countdown':
                content = this.createCountdownHTML(elementData.content);
                break;
                
            default:
                content = document.createElement('div');
                content.className = 'editable';
                content.contentEditable = 'true';
                content.textContent = elementData.content;
        }
        
        elementDiv.appendChild(content);
        
        // Контролы элемента
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.innerHTML = `
            <button class="element-btn edit-btn" title="Редактировать">
                <i class="fas fa-edit"></i>
            </button>
            <button class="element-btn delete-btn" title="Удалить">
                <i class="fas fa-trash"></i>
            </button>
            <button class="element-btn style-btn" title="Стили">
                <i class="fas fa-paint-brush"></i>
            </button>
            ${elementData.type === 'cake' || elementData.type === 'confetti' ? 
                '<button class="element-btn animate-btn" title="Анимация"><i class="fas fa-play"></i></button>' : ''}
        `;
        
        elementDiv.appendChild(controls);
        
        // Обработчики событий
        elementDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.element-controls')) {
                this.selectElement(elementDiv, elementData);
            }
        });
        
        container.appendChild(elementDiv);
    }
    
    createCakeHTML() {
        const cakeDiv = document.createElement('div');
        cakeDiv.className = 'cake-element';
        cakeDiv.innerHTML = `
            <div class="cake">
                <div class="cake-top"></div>
                <div class="cake-middle"></div>
                <div class="cake-bottom"></div>
                <div class="candle">
                    <div class="flame"></div>
                </div>
            </div>
        `;
        
        return cakeDiv;
    }
    
    createQuizHTML(content) {
        try {
            const quizData = JSON.parse(content);
            const quizDiv = document.createElement('div');
            quizDiv.className = 'quiz-element';
            quizDiv.innerHTML = `
                <h4>${quizData.question}</h4>
                <div class="quiz-options">
                    ${quizData.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
                <div class="quiz-result"></div>
            `;
            
            return quizDiv;
        } catch (e) {
            const div = document.createElement('div');
            div.textContent = 'Ошибка загрузки викторины';
            return div;
        }
    }
    
    createCountdownHTML(content) {
        try {
            const data = JSON.parse(content);
            const div = document.createElement('div');
            div.className = 'countdown-element';
            div.innerHTML = `
                <h4>${data.title}</h4>
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <span class="countdown-number days">00</span>
                        <span class="countdown-label">дней</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number hours">00</span>
                        <span class="countdown-label">часов</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number minutes">00</span>
                        <span class="countdown-label">минут</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number seconds">00</span>
                        <span class="countdown-label">секунд</span>
                    </div>
                </div>
            `;
            
            // Запуск таймера
            this.startCountdownTimer(div, data.targetDate);
            
            return div;
        } catch (e) {
            const div = document.createElement('div');
            div.textContent = 'Ошибка загрузки таймера';
            return div;
        }
    }
    
    // Таймер обратного отсчета
    startCountdownTimer(element, targetDate) {
        const updateTimer = () => {
            const now = new Date();
            const target = new Date(targetDate);
            const diff = target - now;

            if (diff <= 0) {
                element.querySelector('.countdown-number').textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            element.querySelector('.days').textContent = days.toString().padStart(2, '0');
            element.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
            element.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
            element.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    // Выбор элемента
    selectElement(element, elementData) {
        // Снимаем выделение со всех элементов
        document.querySelectorAll('.default-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Выделяем текущий элемент
        element.classList.add('selected');
        this.state.selectedElement = element;
        this.state.selectedElementData = elementData;
        
        // Заполняем панель свойств
        this.fillPropertiesPanel(elementData);
    }
    
    // Заполнение панели свойств
    fillPropertiesPanel(elementData) {
        // Тип элемента
        const typeSelect = document.getElementById('elementType');
        if (typeSelect) {
            typeSelect.value = elementData.type;
        }
        
        // Содержимое
        const contentTextarea = document.getElementById('elementContent');
        if (contentTextarea) {
            if (typeof elementData.content === 'object') {
                contentTextarea.value = JSON.stringify(elementData.content, null, 2);
            } else {
                contentTextarea.value = elementData.content;
            }
        }
        
        // Размер
        const widthInput = document.getElementById('elementWidth');
        const heightInput = document.getElementById('elementHeight');
        if (widthInput && heightInput) {
            widthInput.value = parseInt(elementData.size.width) || '';
            heightInput.value = parseInt(elementData.size.height) || '';
        }
        
        // Позиция
        const topInput = document.getElementById('elementTop');
        const leftInput = document.getElementById('elementLeft');
        if (topInput && leftInput) {
            topInput.value = elementData.position.top;
            leftInput.value = elementData.position.left;
        }
        
        // Стили
        if (elementData.styles.fontFamily) {
            const fontSelect = document.getElementById('fontFamily');
            if (fontSelect) fontSelect.value = elementData.styles.fontFamily;
        }
        
        if (elementData.styles.fontSize) {
            const fontSize = parseInt(elementData.styles.fontSize);
            const fontSizeSlider = document.getElementById('fontSize');
            const fontSizeValue = document.getElementById('fontSizeValue');
            if (fontSizeSlider && fontSizeValue) {
                fontSizeSlider.value = fontSize;
                fontSizeValue.textContent = fontSize + 'px';
            }
        }
        
        if (elementData.styles.color) {
            const colorInput = document.getElementById('textColor');
            if (colorInput) colorInput.value = elementData.styles.color;
        }
        
        if (elementData.styles.background) {
            const bgInput = document.getElementById('backgroundColor');
            if (bgInput) bgInput.value = elementData.styles.background;
        }
    }
    
    // Применение свойств
    applyProperties() {
        if (!this.state.selectedElement || !this.state.selectedElementData) return;
        
        const element = this.state.selectedElement;
        const elementData = this.state.selectedElementData;
        const page = this.project.pages[this.state.currentPage];
        const elementIndex = page.elements.findIndex(el => el.id === elementData.id);
        
        if (elementIndex === -1) return;
        
        // Обновляем содержимое
        const contentTextarea = document.getElementById('elementContent');
        if (contentTextarea) {
            elementData.content = contentTextarea.value;
        }
        
        // Обновляем размер
        const widthInput = document.getElementById('elementWidth');
        const heightInput = document.getElementById('elementHeight');
        if (widthInput && heightInput) {
            elementData.size.width = widthInput.value ? widthInput.value + 'px' : 'auto';
            elementData.size.height = heightInput.value ? heightInput.value + 'px' : 'auto';
            
            element.style.width = elementData.size.width;
            element.style.height = elementData.size.height;
        }
        
        // Обновляем позицию
        const topInput = document.getElementById('elementTop');
        const leftInput = document.getElementById('elementLeft');
        if (topInput && leftInput) {
            elementData.position.top = parseInt(topInput.value) || 0;
            elementData.position.left = parseInt(leftInput.value) || 0;
            
            element.style.top = elementData.position.top + 'px';
            element.style.left = elementData.position.left + 'px';
        }
        
        // Обновляем стили
        const fontSelect = document.getElementById('fontFamily');
        if (fontSelect) {
            elementData.styles.fontFamily = fontSelect.value;
            element.style.fontFamily = fontSelect.value;
        }
        
        const fontSizeSlider = document.getElementById('fontSize');
        if (fontSizeSlider) {
            const fontSize = fontSizeSlider.value + 'px';
            elementData.styles.fontSize = fontSize;
            element.style.fontSize = fontSize;
        }
        
        const colorInput = document.getElementById('textColor');
        if (colorInput) {
            elementData.styles.color = colorInput.value;
            element.style.color = colorInput.value;
        }
        
        const bgInput = document.getElementById('backgroundColor');
        if (bgInput) {
            elementData.styles.background = bgInput.value;
            element.style.background = bgInput.value;
        }
        
        // Обновляем элемент в проекте
        page.elements[elementIndex] = elementData;
        this.saveState();
        
        this.showNotification('Свойства применены', 'success');
    }
    
    // Сброс свойств
    resetProperties() {
        this.fillPropertiesPanel(this.state.selectedElementData);
        this.showNotification('Свойства сброшены', 'info');
    }
    
    // Копирование элемента
    copyElement() {
        if (!this.state.selectedElementData) return;
        
        const elementData = JSON.parse(JSON.stringify(this.state.selectedElementData));
        elementData.id = 'element_' + Date.now();
        elementData.position.top += 20;
        elementData.position.left += 20;
        
        const page = this.project.pages[this.state.currentPage];
        page.elements.push(elementData);
        
        this.renderElement(elementData);
        this.saveState();
        
        this.showNotification('Элемент скопирован', 'success');
    }
    
    // Редактирование элемента
    editElement(element) {
        if (!element) return;
        
        const editable = element.querySelector('.editable');
        if (editable) {
            editable.focus();
            this.state.isEditing = true;
        }
    }
    
    // Сохранение содержимого элемента
    saveElementContent(editable) {
        const element = editable.closest('.default-element');
        if (!element) return;
        
        const elementId = element.id;
        const page = this.project.pages[this.state.currentPage];
        const elementIndex = page.elements.findIndex(el => el.id === elementId);
        
        if (elementIndex !== -1) {
            page.elements[elementIndex].content = editable.textContent;
            this.saveState();
        }
        
        this.state.isEditing = false;
    }
    
    // Удаление элемента
    deleteElement(element) {
        if (!element || !confirm('Удалить этот элемент?')) return;
        
        const elementId = element.id;
        const page = this.project.pages[this.state.currentPage];
        const elementIndex = page.elements.findIndex(el => el.id === elementId);
        
        if (elementIndex !== -1) {
            page.elements.splice(elementIndex, 1);
            element.remove();
            this.saveState();
            
            this.deselectElement();
            this.showNotification('Элемент удален', 'success');
        }
    }
    
    // Открытие редактора стилей
    openStyleEditor(element) {
        this.selectElement(element);
        this.switchPropertiesTab(document.querySelector('.prop-tab[data-tab="style"]'));
    }
    
    // Анимация элемента
    animateElement(element) {
        element.classList.add('animate');
        
        setTimeout(() => {
            element.classList.remove('animate');
        }, 1000);
        
        this.showNotification('Анимация запущена', 'info');
    }
    
    // Копирование в буфер обмена
    copyToClipboard(element) {
        const elementId = element.id;
        const page = this.project.pages[this.state.currentPage];
        const elementData = page.elements.find(el => el.id === elementId);
        
        if (elementData) {
            this.state.clipboard = JSON.parse(JSON.stringify(elementData));
            this.showNotification('Элемент скопирован в буфер', 'success');
        }
    }
    
    // Вставка из буфера обмена
    pasteFromClipboard() {
        if (!this.state.clipboard) return;
        
        const elementData = JSON.parse(JSON.stringify(this.state.clipboard));
        elementData.id = 'element_' + Date.now();
        elementData.position.top += 20;
        elementData.position.left += 20;
        
        const page = this.project.pages[this.state.currentPage];
        page.elements.push(elementData);
        
        this.renderElement(elementData);
        this.saveState();
        
        this.showNotification('Элемент вставлен', 'success');
    }
    
    // Снятие выделения
    deselectElement() {
        document.querySelectorAll('.default-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        this.state.selectedElement = null;
        this.state.selectedElementData = null;
    }
    
    // Сохранение состояния
    saveState() {
        const state = {
            project: this.project,
            currentPage: this.state.currentPage
        };
        
        this.state.history.push(JSON.parse(JSON.stringify(state)));
        this.state.historyIndex++;
        
        // Ограничиваем историю
        if (this.state.history.length > 50) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
    }
    
    // Отмена действия
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            const state = this.state.history[this.state.historyIndex];
            this.loadState(state);
            this.showNotification('Действие отменено', 'info');
        }
    }
    
    // Возврат действия
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            const state = this.state.history[this.state.historyIndex];
            this.loadState(state);
            this.showNotification('Действие возвращено', 'info');
        }
    }
    
    // Загрузка состояния
    loadState(state) {
        this.project = state.project;
        this.state.currentPage = state.currentPage;
        this.renderPage();
    }
    
    // Рендер страницы
    renderPage() {
        const container = this.elements.page1Content;
        container.innerHTML = '';
        
        const page = this.project.pages[this.state.currentPage];
        if (page && page.elements) {
            page.elements.forEach(element => {
                this.renderElement(element);
            });
        }
    }
    
    // Переключение категорий элементов
    switchCategory(category) {
        const categoryName = category.dataset.category;
        
        // Обновляем активную категорию
        this.elements.categories.forEach(cat => {
            cat.classList.remove('active');
        });
        category.classList.add('active');
        
        // Показываем соответствующие элементы
        this.elements.elementsCategories.forEach(cat => {
            cat.classList.remove('active');
        });
        
        const targetCategory = document.getElementById(categoryName + 'Elements');
        if (targetCategory) {
            targetCategory.classList.add('active');
        }
    }
    
    // Переключение панелей
    togglePanel(panelName) {
        const panel = panelName === 'elements' ? this.elements.elementsPanel : this.elements.propertiesPanel;
        const toggle = panelName === 'elements' ? this.elements.elementsToggle : this.elements.propertiesToggle;
        
        panel.classList.toggle('active');
        
        // Обновляем иконку кнопки
        const icon = toggle.querySelector('i');
        if (panel.classList.contains('active')) {
            icon.className = panelName === 'elements' ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        } else {
            icon.className = panelName === 'elements' ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
        }
    }
    
    // Переключение вкладок свойств
    switchPropertiesTab(tab) {
        const tabName = tab.dataset.tab;
        
        // Обновляем активную вкладку
        this.elements.propTabs.forEach(t => {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        
        // Показываем соответствующий контент
        this.elements.propertiesSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(tabName + 'Props');
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    // Переключение фона
    switchBackgroundType(option) {
        const bgType = option.dataset.bg;
        
        // Обновляем активную опцию
        this.elements.bgOptions.forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        // Показываем соответствующие контролы
        this.elements.bgControls.forEach(control => {
            control.classList.remove('active');
        });
        
        const targetControl = document.querySelector(`.bg-control[data-control="${bgType}"]`);
        if (targetControl) {
            targetControl.classList.add('active');
        }
    }
    
    // Применение фона
    applyBackground() {
        const activeOption = document.querySelector('.bg-option.active');
        if (!activeOption) return;
        
        const bgType = activeOption.dataset.bg;
        let backgroundValue = '';
        
        switch (bgType) {
            case 'gradient':
                // Здесь будет логика для градиента
                backgroundValue = 'linear-gradient(45deg, #ff6b6b, #feca57)';
                break;
                
            case 'image':
                // Здесь будет логика для изображения
                const fileInput = document.getElementById('bgImageUpload');
                if (fileInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        backgroundValue = `url(${e.target.result})`;
                        this.applyBackgroundToCanvas(backgroundValue);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                    return;
                }
                break;
                
            case 'pattern':
                const patternItem = document.querySelector('.pattern-item.active');
                if (patternItem) {
                    const pattern = patternItem.dataset.pattern;
                    // Здесь будет логика для паттернов
                    backgroundValue = this.getPatternCSS(pattern);
                }
                break;
                
            case 'video':
                const videoUrl = document.getElementById('videoUrl').value;
                if (videoUrl) {
                    backgroundValue = videoUrl;
                }
                break;
        }
        
        this.applyBackgroundToCanvas(backgroundValue);
        this.closeModal('bgSettingsModal');
    }
    
    applyBackgroundToCanvas(background) {
        const canvas = this.elements.cardCanvas;
        canvas.style.background = background;
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundPosition = 'center';
        
        this.project.background = {
            type: 'custom',
            value: background
        };
        
        this.saveState();
        this.showNotification('Фон применен', 'success');
    }
    
    getPatternCSS(pattern) {
        const patterns = {
            dots: 'radial-gradient(#ff6b6b 2px, transparent 2px)',
            lines: 'repeating-linear-gradient(45deg, #48dbfb, #48dbfb 2px, transparent 2px, transparent 10px)',
            squares: 'repeating-linear-gradient(0deg, #1dd1a1, #1dd1a1 2px, transparent 2px, transparent 10px), ' +
                    'repeating-linear-gradient(90deg, #1dd1a1, #1dd1a1 2px, transparent 2px, transparent 10px)',
            hearts: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath fill=\'%23ff6b6b\' d=\'M10 18.5l-1.5-1.5C4.5 13.5 1 10.5 1 7c0-2.5 2-4.5 4.5-4.5C7.5 2.5 8.5 3 10 4c1.5-1 2.5-1.5 4.5-1.5C17 2.5 19 4.5 19 7c0 3.5-3.5 6.5-7.5 10L10 18.5z\'/%3E%3C/svg%3E")'
        };
        
        return patterns[pattern] || patterns.dots;
    }
    
    // Смена темы
    changeTheme(theme) {
        this.elements.body.className = `theme-${theme}`;
        this.project.theme = theme;
        
        // Обновляем активную кнопку темы
        this.elements.themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        this.saveState();
        this.showNotification(`Тема "${this.getThemeName(theme)}" применена`, 'success');
    }
    
    getThemeName(theme) {
        const names = {
            'classic': 'Классическая',
            'elegant': 'Элегантная',
            'nature': 'Природа',
            'space': 'Космос'
        };
        
        return names[theme] || theme;
    }
    
    // Показать предпросмотр
    showPreview() {
        const previewContainer = document.getElementById('previewContainer');
        const cardPage = document.querySelector('.card-page.active');
        
        previewContainer.innerHTML = cardPage.outerHTML;
        this.openModal('previewModal');
    }
    
    // Полноэкранный режим
    enterFullscreen() {
        const previewContainer = document.getElementById('previewContainer');
        const element = previewContainer.querySelector('.card-page');
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    // Поделиться проектом
    shareProject() {
        if (navigator.share) {
            navigator.share({
                title: this.project.name,
                text: this.project.description,
                url: window.location.href
            });
        } else {
            // Копируем ссылку в буфер обмена
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Ссылка скопирована в буфер обмена', 'success');
            });
        }
    }
    
    // Открытие модального окна сохранения
    openSaveModal() {
        document.getElementById('projectModalTitle').innerHTML = '<i class="fas fa-save"></i> Сохранение проекта';
        document.getElementById('confirmProjectBtn').textContent = 'Сохранить';
        
        // Заполняем поля
        document.getElementById('projectName').value = this.project.name;
        document.getElementById('projectDescription').value = this.project.description;
        
        this.switchProjectTab(document.querySelector('.project-tab[data-tab="save"]'));
        this.openModal('projectModal');
    }
    
    // Открытие модального окна загрузки
    openLoadModal() {
        document.getElementById('projectModalTitle').innerHTML = '<i class="fas fa-folder-open"></i> Загрузка проекта';
        document.getElementById('confirmProjectBtn').textContent = 'Загрузить';
        
        this.loadProjectsList();
        this.switchProjectTab(document.querySelector('.project-tab[data-tab="load"]'));
        this.openModal('projectModal');
    }
    
    // Переключение вкладок проекта
    switchProjectTab(tab) {
        const tabName = tab.dataset.tab;
        
        // Обновляем активную вкладку
        this.elements.projectTabs.forEach(t => {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        
        // Показываем соответствующий контент
        this.elements.projectTabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabName + 'Tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
    
    // Обработка действий с проектом
    handleProjectAction() {
        const activeTab = document.querySelector('.project-tab.active');
        
        switch (activeTab.dataset.tab) {
            case 'save':
                this.saveProject();
                break;
            case 'load':
                this.loadProject();
                break;
            case 'templates':
                this.applyTemplate();
                break;
        }
    }
    
    // Сохранение проекта
    saveProject() {
        const projectName = document.getElementById('projectName').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        
        if (!projectName) {
            this.showNotification('Введите название проекта', 'error');
            return;
        }
        
        this.project.name = projectName;
        this.project.description = description;
        
        const projectData = JSON.stringify(this.project, null, 2);
        const blob = new Blob([projectData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}.card.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Сохраняем в локальное хранилище
        this.saveToLocalStorage(projectName, this.project);
        
        this.closeModal('projectModal');
        this.showNotification('Проект сохранен', 'success');
    }
    
    // Сохранение в локальное хранилище
    saveToLocalStorage(name, project) {
        const projects = this.getProjectsFromLocalStorage();
        projects[name] = {
            name: name,
            data: project,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('cardProjects', JSON.stringify(projects));
    }
    
    // Получение проектов из локального хранилища
    getProjectsFromLocalStorage() {
        const projects = localStorage.getItem('cardProjects');
        return projects ? JSON.parse(projects) : {};
    }
    
    // Загрузка списка проектов
    loadProjectsList() {
        const projectsList = document.getElementById('projectsList');
        const projects = this.getProjectsFromLocalStorage();
        
        if (Object.keys(projects).length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>Нет сохраненных проектов</p>
                </div>
            `;
            return;
        }
        
        projectsList.innerHTML = '';
        
        Object.values(projects).forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>${project.date ? new Date(project.date).toLocaleDateString() : 'Дата неизвестна'}</p>
                </div>
                <button class="project-load-btn" data-name="${project.name}">
                    <i class="fas fa-upload"></i>
                </button>
            `;
            
            projectsList.appendChild(projectElement);
        });
        
        // Добавляем обработчики для кнопок загрузки
        document.querySelectorAll('.project-load-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectName = e.target.closest('.project-load-btn').dataset.name;
                this.loadProjectFromLocalStorage(projectName);
            });
        });
    }
    
    // Загрузка проекта из локального хранилища
    loadProjectFromLocalStorage(name) {
        const projects = this.getProjectsFromLocalStorage();
        const project = projects[name];
        
        if (project) {
            this.project = project.data;
            this.state.currentPage = 0;
            this.renderPage();
            this.changeTheme(this.project.theme);
            
            if (this.project.background) {
                this.applyBackgroundToCanvas(this.project.background.value);
            }
            
            this.closeModal('projectModal');
            this.showNotification(`Проект "${name}" загружен`, 'success');
        }
    }
    
    // Загрузка проекта
    loadProject() {
        // Здесь будет загрузка из файла
        this.elements.projectFileUpload.click();
    }
    
    // Обработка загрузки файла проекта
    handleProjectUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const projectData = JSON.parse(event.target.result);
                this.project = projectData;
                this.state.currentPage = 0;
                this.renderPage();
                
                if (this.project.theme) {
                    this.changeTheme(this.project.theme);
                }
                
                if (this.project.background) {
                    this.applyBackgroundToCanvas(this.project.background.value);
                }
                
                this.closeModal('projectModal');
                this.showNotification('Проект загружен', 'success');
            } catch (error) {
                this.showNotification('Ошибка загрузки файла проекта', 'error');
            }
        };
        
        reader.readAsText(file);
        e.target.value = '';
    }
    
    // Применение шаблона
    applyTemplate() {
        // Здесь будет логика применения шаблонов
        this.showNotification('Шаблон применен', 'success');
        this.closeModal('projectModal');
    }
    
    // Открытие модального окна экспорта
    openExportModal() {
        this.generateExportCode();
        this.openModal('exportModal');
    }
    
    // Переключение типа экспорта
    switchExportType(option) {
        const exportType = option.dataset.export;
        
        // Обновляем активную опцию
        this.elements.exportOptions.forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        // Показываем соответствующие настройки
        this.elements.exportSettings.forEach(setting => {
            setting.classList.remove('active');
        });
        
        const targetSetting = document.querySelector(`.export-setting[data-setting="${exportType}"]`);
        if (targetSetting) {
            targetSetting.classList.add('active');
        }
        
        // Генерируем код для выбранного типа
        this.generateExportCode(exportType);
    }
    
    // Генерация кода для экспорта
    generateExportCode(type = 'html') {
        let code = '';
        
        switch (type) {
            case 'html':
                code = this.generateHTMLCode();
                break;
            case 'image':
                code = 'Экспорт в изображение будет доступен после нажатия кнопки "Скачать"';
                break;
            case 'pdf':
                code = 'Экспорт в PDF будет доступен после нажатия кнопки "Скачать"';
                break;
            case 'url':
                code = window.location.href;
                break;
        }
        
        this.elements.exportCode.value = code;
    }
    
    // Генерация HTML кода
    generateHTMLCode() {
        const cardPage = document.querySelector('.card-page.active');
        const clone = cardPage.cloneNode(true);
        
        // Удаляем контролы элементов
        clone.querySelectorAll('.element-controls').forEach(control => {
            control.remove();
        });
        
        // Делаем элементы нередактируемыми
        clone.querySelectorAll('.editable').forEach(element => {
            element.removeAttribute('contenteditable');
            element.classList.remove('editable');
        });
        
        // Добавляем стили
        const styles = document.createElement('style');
        styles.textContent = `
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .card-page {
                width: 800px;
                min-height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
                padding: 32px;
                position: relative;
            }
            
            ${this.generateElementStyles()}
        `;
        
        // Создаем полный HTML документ
        return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.project.name}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marck+Script&family=Roboto:wght@300;400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${styles.outerHTML}
</head>
<body>
    ${clone.outerHTML}
    
    <script>
        // Добавляем интерактивность
        ${this.generateJavaScriptCode()}
    </script>
</body>
</html>`;
    }
    
    // Генерация стилей элементов
    generateElementStyles() {
        let styles = '';
        
        this.project.pages[this.state.currentPage].elements.forEach(element => {
            const elementId = element.id;
            let elementStyles = '';
            
            Object.keys(element.styles).forEach(key => {
                elementStyles += `${key}: ${element.styles[key]};\n`;
            });
            
            styles += `#${elementId} {\n${elementStyles}}\n\n`;
        });
        
        return styles;
    }
    
    // Генерация JavaScript кода
    generateJavaScriptCode() {
        return `
        // Анимация торта
        const cake = document.querySelector('.cake');
        if (cake) {
            cake.addEventListener('click', function() {
                const flame = this.querySelector('.flame');
                flame.style.animation = 'none';
                flame.style.opacity = '0';
                
                // Создаем дым
                const smoke = document.createElement('div');
                smoke.style.position = 'absolute';
                smoke.style.width = '30px';
                smoke.style.height = '30px';
                smoke.style.background = 'rgba(200, 200, 200, 0.7)';
                smoke.style.borderRadius = '50%';
                smoke.style.top = '-60px';
                smoke.style.left = '-10px';
                smoke.style.animation = 'smokeRise 2s forwards';
                this.appendChild(smoke);
                
                setTimeout(() => smoke.remove(), 2000);
            });
        }
        
        // Конфетти
        const confettiElements = document.querySelectorAll('.confetti-element');
        confettiElements.forEach(element => {
            element.addEventListener('click', function() {
                createConfetti(50);
            });
        });
        
        function createConfetti(count) {
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1'];
            const container = document.querySelector('.card-page');
            
            for (let i = 0; i < count; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.animation = 'fall 5s linear forwards';
                
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }
        }
        
        // Добавляем CSS анимации
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes smokeRise {
                0% { transform: translateY(0) scale(1); opacity: 0.7; }
                100% { transform: translateY(-100px) scale(3); opacity: 0; }
            }
            
            @keyframes fall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(700px) rotate(360deg); opacity: 0; }
            }
        \`;
        document.head.appendChild(style);
        `;
    }
    
    // Копирование кода экспорта
    copyExportCode() {
        this.elements.exportCode.select();
        this.elements.exportCode.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(this.elements.exportCode.value).then(() => {
            this.showNotification('Код скопирован в буфер обмена', 'success');
        });
    }
    
    // Скачивание экспорта
    async downloadExport() {
        const activeOption = document.querySelector('.export-option.active');
        const exportType = activeOption.dataset.export;
        
        switch (exportType) {
            case 'html':
                this.downloadHTML();
                break;
            case 'image':
                await this.downloadImage();
                break;
            case 'pdf':
                await this.downloadPDF();
                break;
            case 'url':
                this.shareProject();
                break;
        }
    }
    
    // Скачивание HTML
    downloadHTML() {
        const htmlCode = this.generateHTMLCode();
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.project.name}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('HTML файл скачан', 'success');
    }
    
    // Скачивание изображения
    async downloadImage() {
        const cardPage = document.querySelector('.card-page.active');
        
        try {
            const canvas = await html2canvas(cardPage, {
                scale: 2,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = `${this.project.name}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.showNotification('Изображение скачано', 'success');
        } catch (error) {
            this.showNotification('Ошибка создания изображения', 'error');
        }
    }
    
    // Скачивание PDF
    async downloadPDF() {
        const cardPage = document.querySelector('.card-page.active');
        
        try {
            const canvas = await html2canvas(cardPage, {
                scale: 2,
                backgroundColor: null
            });
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${this.project.name}.pdf`);
            
            this.showNotification('PDF документ скачан', 'success');
        } catch (error) {
            this.showNotification('Ошибка создания PDF', 'error');
        }
    }
    
    // Переключение вкладок помощи
    switchHelpTab(tab) {
        const tabName = tab.dataset.tab;
        
        // Обновляем активную вкладку
        this.elements.helpTabs.forEach(t => {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        
        // Показываем соответствующий контент
        this.elements.helpTabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabName + 'Help');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
    
    // Открытие модального окна
    openModal(modalId) {
        this.elements.modalOverlay.classList.add('active');
        this.modals[modalId].classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие модального окна
    closeModal(modalId) {
        this.elements.modalOverlay.classList.remove('active');
        this.modals[modalId].classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Закрытие всех модальных окон
    closeAllModals() {
        this.elements.modalOverlay.classList.remove('active');
        this.elements.modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    // Показать контекстное меню
    showContextMenu(e) {
        e.preventDefault();
        
        const contextMenu = this.elements.contextMenu;
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.style.display = 'block';
        
        // Проверяем, на каком элементе вызвано меню
        const element = e.target.closest('.default-element');
        if (element) {
            this.selectElement(element);
        }
    }
    
    // Скрыть контекстное меню
    hideContextMenu() {
        this.elements.contextMenu.style.display = 'none';
    }
    
    // Обработка клика на холсте
    handleCanvasClick(e) {
        if (!e.target.closest('.default-element') && !e.target.closest('.element-controls')) {
            this.deselectElement();
        }
    }
    
    // Обработка клика на элемент
    handleElementClick(e, element) {
        e.stopPropagation();
        this.selectElement(element);
    }
    
    // Обработка изменения размера
    handleResize(element) {
        // Можно добавить логику адаптации элементов
    }
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        const id = 'notification_' + Date.now();
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <div class="notification-content">
                <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="document.getElementById('${id}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.elements.notificationContainer.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            const note = document.getElementById(id);
            if (note) note.remove();
        }, 5000);
        
        this.notifications.push(id);
    }
    
    // Скрыть загрузчик
    hideLoader() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.elements.loaderBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.elements.loaderOverlay.style.opacity = '0';
                    setTimeout(() => {
                        this.elements.loaderOverlay.style.display = 'none';
                    }, 500);
                }, 300);
            }
        }, 100);
    }
    
    // Получение названия элемента по типу
    getElementTitle(type) {
        const titles = {
            'heading': 'Заголовок',
            'subheading': 'Подзаголовок',
            'paragraph': 'Абзац',
            'message': 'Сообщение',
            'list': 'Список',
            'quote': 'Цитата',
            'image': 'Изображение',
            'gallery': 'Галерея',
            'video': 'Видео',
            'audio': 'Аудио',
            'cake': 'Торт',
            'confetti': 'Конфетти',
            'quiz': 'Викторина',
            'memory': 'Игра на память',
            'puzzle': 'Пазл',
            'poem': 'Стихи',
            'wishlist': 'Пожелания',
            'counter': 'Счетчик',
            'countdown': 'Таймер',
            'calendar': 'Календарь',
            'guestbook': 'Гостевая книга',
            'poll': 'Опрос',
            'form': 'Форма',
            'social': 'Соц. сети',
            'html': 'HTML блок',
            'javascript': 'JavaScript',
            'api': 'API',
            'animation': 'Анимация',
            'effect': 'Эффекты',
            'container': 'Контейнер'
        };
        
        return titles[type] || type;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.cardConstructor = new CardConstructor();
});

// Глобальные функции для контекстного меню
document.addEventListener('click', (e) => {
    if (e.target.closest('.context-item')) {
        const action = e.target.closest('.context-item').dataset.action;
        if (window.cardConstructor && window.cardConstructor[action]) {
            window.cardConstructor[action]();
        }
    }
});









































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































