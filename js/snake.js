"use strict";

class Constants {

    static numArenaRows = 31;
    static numArenaCols = 33;
    static levelNumStorageKey = 'loadedLevelNum';

    static directions = {
        North: 'N',
        East: 'E',
        South: 'S',
        West: 'W',
        NorthWest: 'NW',
        NorthEast: 'NE',
        SouthWest: 'SW',
        SouthEast: 'SE'
    }

    static gameStates = {
        Resetting: 'Resetting',
        Reset: 'Reset',
        LoadingLevel: 'LoadingLevel',
        StartingLevel: 'StartingLevel',
        PlayingLevel: 'PlayingLevel',
        Paused: 'Paused',
        Winner: 'Winner'
    };

    static arenaCellStates = {
        Vacant: 'vacant',
        Wall: 'wall',
        SnakeBody: 'snakebody',
        SnakeHead: 'snakehead',
        Food: 'food',
        SnakeHeadDead: 'snakeheaddead'
    }

    static headerMessageTypes = {
        levelHeader: 'levelHeader',
        messageHeader: 'messageHeader',
        foodHeader: 'foodHeader'
    }

    static arenaMessageTypes = {
        fullscreen: 'fullscreen',
        popup: 'popup'
    }

    static soundFxTypes = {
        chomp: 'chomp',
        crunch: 'crunch',
        victory: 'victory',
        beep: 'beep',
        pause: 'pause',
        unpause: 'unpause',
        reset: 'reset',
        click: 'click',
        winner: 'winner'
    }

}

class ViewOutput {

    static _elements = {
        document: document.documentElement,
        loading: document.getElementById( 'loading' ),
        loaded: document.getElementById( 'loaded' ),
        arenaGrid: document.getElementById( 'arena-grid' ),
        instructions: document.getElementById( 'instructions' ),
        snakeButton: document.getElementById( 'snake-button' ),
        touchPad: document.getElementById( 'touchpad-panel' ),
        levelHeader: document.getElementById( 'level-header' ),
        foodHeader: document.getElementById( 'food-header' ),
        messageHeader: document.getElementById( 'message-header' ),
        arenaMessageContainer: document.getElementById( 'arena-message-container' ),
        arenaMessage: document.getElementById( 'arena-message' ),
        touchpadLeftUp: document.getElementById( 'pad-left-up' ),
        touchpadRightUp: document.getElementById( 'pad-right-up' ),
        touchpadLeftDown: document.getElementById( 'pad-left-down' ),
        touchpadRightDown: document.getElementById( 'pad-right-down' )
    }

    static _cssOutputVariables = {
        arenaNumGridRows: '--js-arena-num-grid-rows',
        arenaNumGridCols: '--js-arena-num-grid-cols',
        arenaHeaderRowSpan: '--js-arena-header-row-span',
        fullViewportHeight: '--js-100vh',
        fullViewportWidth: '--js-100vw',
        fourtyPercentViewportHeight: '--js-40vh',
        fourtyPercentViewportWidth: '--js-40vw'
    }

    static _cssClassNames = {
        notDisplayed: 'not-displayed',
        notVisible: 'not-visible',
        arenaMessageContainerPopup: 'arena-message-container-popup',
        arenaMessageContainerFullscreen: 'arena-message-container-fullscreen',
        arenaMessagePopup: 'arena-message-popup',
        touchpadClicked: 'touchpad-clicked',
        snakeButtonClicked: 'snake-button-clicked',
        wall: 'wall',
        snakeBody: 'snakebody',
        snakeHead: 'snakehead',
        snakeHeadDead: 'snakeheaddead',
        food: 'food'
    }

    static _messages = {
        paused: document.getElementById( 'message-paused' ).textContent,
        resettingGame: document.getElementById( 'message-resetting' ).textContent,
        continuingGame: document.getElementById( 'message-continuing-game' ).textContent,
        youDied: document.getElementById( 'message-you-died' ).textContent,
        tryAgain: document.getElementById( 'message-try-again' ).textContent,
        level: document.getElementById( 'message-level' ).textContent,
        youWon: document.getElementById( 'message-you-won' ).textContent,
        thanksForPlaying: document.getElementById( 'message-thanks' ).textContent
    }

    static _soundFxElements = {
        crunch: document.getElementById( 'soundFx_crunch' ),
        chomp: document.getElementById( 'soundFx_chomp' ),
        victory: document.getElementById( 'soundFx_victory' ),
        beep: document.getElementById( 'soundFx_beep' ),
        pause: document.getElementById( 'soundFx_pause' ),
        unpause: document.getElementById( 'soundFx_unpause' ),
        reset: document.getElementById( 'soundFx_reset' ),
        click: document.getElementById( 'soundFx_click' ),
        winner: document.getElementById( 'soundFx_winner' )
    }

    static get Messages() {
        return this._messages;
    }

    static _arenaCellIdSet = new Set();
    static get ArenaCellIdSet() {
        return this._arenaCellIdSet;
    }

    static GetArenaCellId( rowNum, colNum ) {
        return `ac_${rowNum}_${colNum}`;
    }

    static CreateArena() {

        let documentStyle = this._elements.document.style;
        documentStyle.setProperty( this._cssOutputVariables.arenaNumGridRows, Constants.numArenaRows );
        documentStyle.setProperty( this._cssOutputVariables.arenaNumGridCols, Constants.numArenaCols );
        documentStyle.setProperty( this._cssOutputVariables.arenaHeaderRowSpan, Constants.numArenaCols - Constants.numArenaRows );

        let fragment = new DocumentFragment();

        for ( let row = 1; row <= Constants.numArenaRows; row++ ) {
            for ( let col = 1; col <= Constants.numArenaCols; col++ ) {
                let arenaCell = document.createElement( 'div' );
                let arenaCellId = this.GetArenaCellId( row, col );
                arenaCell.id = arenaCellId;

                fragment.appendChild( arenaCell );
                this._arenaCellIdSet.add( arenaCellId );
            }
        }

        this._elements.arenaGrid.appendChild( fragment );
        this.SizeArena();
    }

    static GetArenaSizePx() {
        return this._elements.arenaGrid.clientWidth;
    }

    static SizeArena() {
        let documentStyle = this._elements.document.style;
        documentStyle.setProperty( this._cssOutputVariables.fullViewportHeight, `${window.innerHeight}px` );
        documentStyle.setProperty( this._cssOutputVariables.fullViewportWidth, `${window.innerWidth}px` );
        documentStyle.setProperty( this._cssOutputVariables.fourtyPercentViewportHeight, `${window.innerHeight * 0.4}px` );
        documentStyle.setProperty( this._cssOutputVariables.fourtyPercentViewportWidth, `${window.innerWidth * 0.4}px` );
    }

    static ShowArena() {
        this._elements.loading.classList.add( this._cssClassNames.notDisplayed );
        this._elements.loaded.classList.remove( this._cssClassNames.notVisible );
    }

    static GetSnakeButtonElement() {
        return this._elements.snakeButton;
    }

    static GetTouchpadElement() {
        return this._elements.touchPad;
    }

    static ShowInstructions( isDisplayed ) {
        if ( isDisplayed ) {
            this._elements.instructions.classList.remove( this._cssClassNames.notDisplayed );
        } else {
            this._elements.instructions.classList.add( this._cssClassNames.notDisplayed );
        }
    }

    static SetHeader( value, headerMessageType ) {
        let element;
        switch( headerMessageType ) {
            case Constants.headerMessageTypes.levelHeader:
                element = this._elements.levelHeader.firstElementChild;
                this._elements.levelHeader.classList.remove( this._cssClassNames.notDisplayed );
                break;

            case Constants.headerMessageTypes.foodHeader:
                element = this._elements.foodHeader.firstElementChild;
                this._elements.foodHeader.classList.remove( this._cssClassNames.notDisplayed );
                break;

            case Constants.headerMessageTypes.messageHeader:
                element = this._elements.messageHeader;
                this._elements.messageHeader.classList.remove( this._cssClassNames.notDisplayed );
                break;
        }

        element.textContent = value;
    }

    static ClearHeader( headerMessageType ) {
        let element;
        switch( headerMessageType ) {
            case Constants.headerMessageTypes.levelHeader:
                element = this._elements.levelHeader;
                break;

            case Constants.headerMessageTypes.foodHeader:
                element = this._elements.foodHeader;
                break;

            case Constants.headerMessageTypes.messageHeader:
                element = this._elements.messageHeader;
                break;
        }

        element.classList.add( this._cssClassNames.notDisplayed );
    }

    static SetArenaMessage( message, messageType ) {

        if ( message != this.Messages.paused ) {
            this._currentArenaMessageValue = message;
        }

        let arenaMessageContainer = this._elements.arenaMessageContainer;
        let arenaMessage = this._elements.arenaMessage;

        arenaMessageContainer.classList.remove( this._cssClassNames.notDisplayed );

        switch( messageType ) {
            case Constants.arenaMessageTypes.fullscreen:
                arenaMessageContainer.classList.remove( this._cssClassNames.arenaMessageContainerPopup );
                arenaMessage.classList.remove( this._cssClassNames.arenaMessagePopup );

                arenaMessageContainer.classList.add( this._cssClassNames.arenaMessageContainerFullscreen );

                arenaMessage.textContent = message;
                break;

            case Constants.arenaMessageTypes.popup:
                arenaMessageContainer.classList.remove( this._cssClassNames.arenaMessageContainerFullscreen );

                arenaMessageContainer.classList.add( this._cssClassNames.arenaMessageContainerPopup );
                arenaMessage.classList.add( this._cssClassNames.arenaMessagePopup );

                arenaMessage.textContent = message;
                break;
        }

    }

    static ClearArenaMessage() {
        this._elements.arenaMessageContainer.classList.remove( this._cssClassNames.arenaMessageContainerPopup );
        this._elements.arenaMessageContainer.classList.remove( this._cssClassNames.arenaMessageContainerFullscreen );
        this._elements.arenaMessageContainer.classList.add( this._cssClassNames.notDisplayed );

        this._currentArenaMessageValue = this._elements.arenaMessage.textContent = '';
    }

    static _currentArenaMessageValue;
    static SetPaused( isPaused ) {

        if ( isPaused ) {
            this.SetArenaMessage( this.Messages.paused, Constants.arenaMessageTypes.popup );
            return;
        }

        if ( this._currentArenaMessageValue == '' ) {
            this.ClearArenaMessage();
        } else {
            this.SetArenaMessage( this._currentArenaMessageValue, Constants.arenaMessageTypes.popup );
        }
    }

    static SetArenaCellState( cellId, state ) {
        let cell = document.getElementById( cellId );
        switch( state ) {
            case Constants.arenaCellStates.Vacant:
                cell.className = '';
                break;
            case Constants.arenaCellStates.Wall:
                cell.className = this._cssClassNames.wall;
                break;
              case Constants.arenaCellStates.SnakeBody:
                cell.className = this._cssClassNames.snakeBody;
                break;
            case Constants.arenaCellStates.SnakeHead:
                cell.className = this._cssClassNames.snakeHead;
                break;
            case Constants.arenaCellStates.SnakeHeadDead:
                cell.className = this._cssClassNames.snakeHeadDead;
                break;
            case Constants.arenaCellStates.Food:
                cell.className = this._cssClassNames.food;
        }
    }

    static ClickTouchpad( direction ) {
        switch( direction ) {
            case Constants.directions.North:
                this._elements.touchpadLeftUp.classList.add( this._cssClassNames.touchpadClicked );
                this._elements.touchpadRightUp.classList.add( this._cssClassNames.touchpadClicked );
            break;
            case Constants.directions.East:
                this._elements.touchpadRightUp.classList.add( this._cssClassNames.touchpadClicked );
                this._elements.touchpadRightDown.classList.add( this._cssClassNames.touchpadClicked );
            break;
            case Constants.directions.South:
                this._elements.touchpadLeftDown.classList.add( this._cssClassNames.touchpadClicked );
                this._elements.touchpadRightDown.classList.add( this._cssClassNames.touchpadClicked );
            break;
            case Constants.directions.West:
                this._elements.touchpadLeftUp.classList.add( this._cssClassNames.touchpadClicked );
                this._elements.touchpadLeftDown.classList.add( this._cssClassNames.touchpadClicked );
            break;
        }
        setTimeout( () =>{
            this._elements.touchpadLeftDown.classList.remove( this._cssClassNames.touchpadClicked );
            this._elements.touchpadLeftUp.classList.remove( this._cssClassNames.touchpadClicked );
            this._elements.touchpadRightDown.classList.remove( this._cssClassNames.touchpadClicked );
            this._elements.touchpadRightUp.classList.remove( this._cssClassNames.touchpadClicked );
        }, 100 );
    }

    static PressSnakeButton() {
        this._elements.snakeButton.classList.add( this._cssClassNames.snakeButtonClicked );
    }

    static ReleaseSnakeButton() {
        this._elements.snakeButton.classList.remove( this._cssClassNames.snakeButtonClicked );
    }

    static PlaySound( sfxType ) {
        try {
            switch ( sfxType ) {
                case Constants.soundFxTypes.crunch:
                    this._soundFxElements.crunch.play();
                    break;
                case Constants.soundFxTypes.chomp:
                    this._soundFxElements.chomp.play();
                    break;
                case Constants.soundFxTypes.victory:
                    this._soundFxElements.victory.play();
                    break;
                case Constants.soundFxTypes.beep:
                    this._soundFxElements.beep.play();
                    break;
                case Constants.soundFxTypes.pause:
                    this._soundFxElements.pause.play();
                    break;
                case Constants.soundFxTypes.unpause:
                    this._soundFxElements.unpause.play();
                    break;
                case Constants.soundFxTypes.reset:
                    this._soundFxElements.reset.play();
                    break;
                case Constants.soundFxTypes.click:
                    this._soundFxElements.click.play();
                    break;
                case Constants.soundFxTypes.winner:
                    this._soundFxElements.winner.play();
                    break;
            }
        } catch ( e ) {
            console.log( `Cannot play sfx ${e}` );
        }
    }

}

class ViewInput {

    static _snakeButtonTimerId;

    static OnDomLoaded() {
        ViewOutput.CreateArena();
    }

    static OnLoad() {
        ViewOutput.ShowArena();
    }

    static OnResize() {
        ViewOutput.SizeArena();
    }

    static OnSnakeButtonDown( event ) {
        event.preventDefault(); // Stop touch devices from also triggering the mouse events

        // If it is a mouse, then only respond to the left click
        if ( event instanceof MouseEvent && event.button != 0 ) {
            event.stopPropagation();
            return;
        }

        ViewOutput.PressSnakeButton();

        this._snakeButtonTimerId = setTimeout( () => {
            this._snakeButtonTimerId = null;
            GameController.ResetGame();
        }, 2000 );
    }

    static OnSnakeButtonUp() {
        ViewOutput.ReleaseSnakeButton();
        if ( this._snakeButtonTimerId ) {
            clearTimeout( this._snakeButtonTimerId );

            switch( GameController.state ) {
                case Constants.gameStates.Reset:
                case Constants.gameStates.Winner:
                    GameController.StartGame();
                    break;

                default:
                    GameController.PauseGame();
                    break;
            }

        }
    }

    // In the case user clicks, but then pulls off the button to cancel
    static OnSnakeButtonOut() {
        clearTimeout( this._snakeButtonTimerId );
        ViewOutput.ReleaseSnakeButton();
    }

    static OnKeyDown( event ) {
        switch ( event.key ) {
            case "Escape":
                if (
                    GameController.state == Constants.gameStates.StartingLevel ||
                    GameController.state == Constants.gameStates.PlayingLevel ||
                    GameController.state == Constants.gameStates.Paused
                ) {
                    ViewOutput.PressSnakeButton();
                }
                break;
            case "N":
            case "n":
                if ( GameController.state == Constants.gameStates.Reset ) {
                    ViewOutput.PressSnakeButton();
                }
                break;
            case "R":
            case "r":
                ViewOutput.PressSnakeButton();
                break;
        }
    }

    static OnKeyUp( event ) {
        switch ( event.key ) {
            case "ArrowLeft":
                GameController.SetNextSnakeDirection( Constants.directions.West );
                break;
            case "ArrowRight":
                GameController.SetNextSnakeDirection( Constants.directions.East );
                break;
            case "ArrowUp":
                GameController.SetNextSnakeDirection( Constants.directions.North );
                break;
            case "ArrowDown":
                GameController.SetNextSnakeDirection( Constants.directions.South );
                break;
            case "Escape":
                ViewOutput.ReleaseSnakeButton();
                GameController.PauseGame();
                break;
            case "N":
            case "n":
                ViewOutput.ReleaseSnakeButton();
                GameController.StartGame();
                break;
            case "R":
            case "r":
                ViewOutput.ReleaseSnakeButton();
                GameController.ResetGame();
                break;
        }

    };

    static OnTouchpadPressed( event ) {
        let boundingRect = event.currentTarget.getBoundingClientRect();
        let touchpadYCenter = ( boundingRect.bottom - boundingRect.top ) / 2;
        let touchpadXCenter = ( boundingRect.right - boundingRect.left ) / 2;
        let touchedX = event.clientX - boundingRect.left;
        let touchedY = event.clientY - boundingRect.top;

        let nextDirection;
        if ( touchedX < touchpadXCenter ) {
            nextDirection = touchedY < touchpadYCenter ? Constants.directions.NorthWest : Constants.directions.SouthWest;
        } else {
            nextDirection = touchedY < touchpadYCenter ? Constants.directions.NorthEast : Constants.directions.SouthEast;
        }

        GameController.SetNextSnakeDirection( nextDirection );
    }

}

class GameController {

    static _levels = LevelData.Levels;

    static _defaultLevelContext = {
        startCountdown: 3,
        vacancies: {
            cellIdsSet: ViewOutput.ArenaCellIdSet
        },
        walls: {
            cellIdsSet: new Set()
        },
        snake: {
            cellIdsSet: new Set(),
            cellIdsDQueue: [],
            direction: null,
            nextDirection: null,
            headRow: null,
            headCol: null,
            length: 3,
            growthRate: 6
        },
        food: {
            cellId: null,
            numRemaining: 10
        }
    }

    static _context = {
        state: Constants.gameStates.Reset,
        lastState: Constants.gameStates.Reset,
        timerId: null,
        timerPeriod: {
            currentLevel: null,
            currentPeriodMs: null,
            defaultStartLevelPeriodMs: 250,
            startLevelPeriodMs: 250,
            minPeriodMs: 150,
            maxPeriodMs: 500,
            deltaPeriodMs: 3
        },
        loadedLevelNum: null,
        levelContext: structuredClone( this._defaultLevelContext )
    }

    static get state() {
        return this._context.state;
    }

    static set _state( value ) {
        this._context.state = value;
    }

    static get _loadedLevelNum() {
        return this._context.loadedLevelNum;
    }

    static set _loadedLevelNum( value ) {
        this._context.loadedLevelNum = value;
    }

    static get _loadedLevel() {
        return this._levels[this._loadedLevelNum-1];
    }

    static get _levelContext() {
        return this._context.levelContext;
    }

    static set _levelContext( value ) {
        this._context.levelContext = value;
    }

    static ResetGame() {
        this._StopClock();
        this._ClearSavedLevelNum();
        this._state = Constants.gameStates.Resetting;

        ViewOutput.SetArenaMessage( ViewOutput.Messages.resettingGame, Constants.arenaMessageTypes.fullscreen );
        ViewOutput.PlaySound( Constants.soundFxTypes.reset );

        this._StartClock( () => {
            this._state = Constants.gameStates.Reset;
            ViewOutput.ClearArenaMessage();
            ViewOutput.ClearHeader( Constants.headerMessageTypes.messageHeader );
            ViewOutput.SetPaused( false );
            ViewOutput.ShowInstructions( true );
        }, 2500 );
    }

    static StartGame() {
        if ( this.state == Constants.gameStates.Reset ) {
            this._state = Constants.gameStates.LoadingLevel;
            this._LoadLevelNum();
            ViewOutput.ShowInstructions( false );

            if ( this._loadedLevelNum != 1 ) {
                ViewOutput.SetArenaMessage( ViewOutput.Messages.continuingGame, Constants.arenaMessageTypes.fullscreen );
                this._StartClock( () => this._LoadLevel(), 1000 );
                return;
            }

            this._StartClock( () => this._LoadLevel() );
        }

        if ( this.state == Constants.gameStates.Winner ) {
            this.ResetGame();
        }
    }

    static PauseGame() {
        switch( this.state ) {
            case Constants.gameStates.PlayingLevel:
            case Constants.gameStates.StartingLevel:
                this._context.lastState = this.state;
                this._StopClock();
                ViewOutput.SetPaused( true );
                ViewOutput.PlaySound( Constants.soundFxTypes.pause );
                this._state = Constants.gameStates.Paused;
                break;

            case Constants.gameStates.Paused:
                this._state = this._context.lastState;

                ViewOutput.SetPaused( false );
                ViewOutput.PlaySound( Constants.soundFxTypes.unpause );

                if ( this.state == Constants.gameStates.StartingLevel ) {
                    this._StartClock( () => this._StartLevel(), 1000 );
                } else {
                    this._StartClock( () => this._PlayLevel() );
                }
                break;
        }
    }

    static SetNextSnakeDirection( nextDirection ) {
        if ( this.state != Constants.gameStates.PlayingLevel ) {
            return;
        }

        switch( this._levelContext.snake.direction ) {
            case Constants.directions.North:
            case Constants.directions.South:
                switch( nextDirection ) {
                    case Constants.directions.East:
                    case Constants.directions.NorthEast:
                    case Constants.directions.SouthEast:
                        this._context.levelContext.snake.nextDirection = Constants.directions.East;
                        ViewOutput.ClickTouchpad( Constants.directions.East );
                        break;
                    case Constants.directions.West:
                    case Constants.directions.NorthWest:
                    case Constants.directions.SouthWest:
                        this._context.levelContext.snake.nextDirection = Constants.directions.West;
                        ViewOutput.ClickTouchpad( Constants.directions.West );
                        break;
                }
                break;
            case Constants.directions.East:
            case Constants.directions.West:
                switch( nextDirection ) {
                    case Constants.directions.North:
                    case Constants.directions.NorthEast:
                    case Constants.directions.NorthWest:
                        this._levelContext.snake.nextDirection = Constants.directions.North;
                        ViewOutput.ClickTouchpad( Constants.directions.North );
                        break;
                    case Constants.directions.South:
                    case Constants.directions.SouthEast:
                    case Constants.directions.SouthWest:
                        this._levelContext.snake.nextDirection = Constants.directions.South;
                        ViewOutput.ClickTouchpad( Constants.directions.South );
                        break;
                }
                break;
        }
    }

    static _StopClock() {
        clearTimeout( this._context.timerId );
    }

    static _StartClock( func, periodMs ) {
        if ( periodMs == null ) periodMs = 0;
        this._context.timerId = setTimeout( func, periodMs );
    }

    static _LoadLevel() {
        this._levelContext = structuredClone( this._defaultLevelContext );

        this._LoadStartingLevelPeriod();
        this._LoadLevelWalls();
        this._LoadLevelSnake();
        this._LoadLevelArena();
        this._LoadLevelFood();

        this._SaveLevelNum();

        let currentLevel = this._levels.length + 1 - this._loadedLevelNum;
        ViewOutput.SetArenaMessage(
            ViewOutput.Messages.level.replace( '[0]', currentLevel ),
            Constants.arenaMessageTypes.popup
        );
        ViewOutput.SetHeader( currentLevel, Constants.headerMessageTypes.levelHeader );
        ViewOutput.SetHeader( this._levelContext.food.numRemaining, Constants.headerMessageTypes.foodHeader );
        ViewOutput.SetHeader( this._loadedLevel.name, Constants.headerMessageTypes.messageHeader );

        this._StartClock( () => {
            this._state = Constants.gameStates.StartingLevel;
            this._StartLevel()
        }, 1000 );
    }

    static _LoadLevelWalls() {
        this._loadedLevel.walls.forEach(
            ([row, col]) => {
                this._levelContext.walls.cellIdsSet.add( ViewOutput.GetArenaCellId( row, col ) );
            }
        );
    }

    static _GetCurrentPeriodMs() {

        // Apply a subtle scaling of speed to users viewport
        // Otherwise it feels too fast on smaller viewports, and too slow on larger ones
        let ratioOfArenaSizeToSmallestPossible = ViewOutput.GetArenaSizePx() / 320;
        let periodDecrease = ratioOfArenaSizeToSmallestPossible * 25;
        return this._context.timerPeriod.currentPeriodMs - periodDecrease;
    }

    static _LoadStartingLevelPeriod() {
        if ( this._context.timerPeriod.currentLevel != this._loadedLevelNum ) {
            this._context.timerPeriod.currentLevel = this._loadedLevelNum;
            this._context.timerPeriod.startLevelPeriodMs = this._context.timerPeriod.defaultStartLevelPeriodMs;
        }

        this._context.timerPeriod.currentPeriodMs = this._context.timerPeriod.startLevelPeriodMs;
    }

    static _IncreaseStartingLevelPeriod() {
        this._context.timerPeriod.startLevelPeriodMs = Math.min(
            this._context.timerPeriod.startLevelPeriodMs + this._context.timerPeriod.deltaPeriodMs,
            this._context.timerPeriod.maxPeriodMs
        );
    }

    static _DecreaseCurrentLevelPeriod() {
        this._context.timerPeriod.currentPeriodMs = Math.max(
            this._context.timerPeriod.currentPeriodMs - this._context.timerPeriod.deltaPeriodMs,
            this._context.timerPeriod.minPeriodMs
        );
    }

    static _LoadLevelSnake() {

        let snake = this._levelContext.snake;
        [snake.headRow, snake.headCol] = this._loadedLevel.snakeHead;
        snake.direction = snake.nextDirection = this._loadedLevel.snakeDirection;

        while ( snake.cellIdsSet.size < snake.length ) {
            let arenaCellId = ViewOutput.GetArenaCellId( snake.headRow, snake.headCol );

            snake.cellIdsSet.add( arenaCellId );
            snake.cellIdsDQueue.unshift( arenaCellId );

            switch( snake.direction ) {
                case Constants.directions.North:
                    snake.headRow += 1;
                    break;
                case Constants.directions.East:
                    snake.headCol  -= 1;
                    break;
                case Constants.directions.South:
                    snake.headRow  -= 1;
                    break;
                case Constants.directions.West:
                    snake.headCol += 1;
                    break;
            }
        }

        [snake.headRow, snake.headCol] = this._loadedLevel.snakeHead;
    }

    // Walls and snake must be loaded first; this will then populate the arena based on what vacant cells should remain
    static _LoadLevelArena() {
        let vacancies = this._levelContext.vacancies;
        let walls = this._levelContext.walls;
        let snake = this._levelContext.snake;
        let snakeHeadCellId = snake.cellIdsDQueue.slice(-1);

        vacancies.cellIdsSet.forEach( ( arenaCellId ) => {
            if ( walls.cellIdsSet.has( arenaCellId ) ) {
                ViewOutput.SetArenaCellState( arenaCellId, Constants.arenaCellStates.Wall );
                vacancies.cellIdsSet.delete( arenaCellId );
            } else if ( snake.cellIdsSet.has( arenaCellId ) ) {
                ViewOutput.SetArenaCellState(
                    arenaCellId,
                    snakeHeadCellId == arenaCellId ? Constants.arenaCellStates.SnakeHead : Constants.arenaCellStates.SnakeBody
                );
                vacancies.cellIdsSet.delete( arenaCellId );
            } else {
                ViewOutput.SetArenaCellState( arenaCellId, Constants.arenaCellStates.Vacant );
            }
        });
    }

    // The food must be loaded last to ensure it pulls only from valid vacant cells
    static _LoadLevelFood() {
        let food = this._levelContext.food;
        food.cellId = this._GetNextFoodCellId();
        ViewOutput.SetArenaCellState( food.cellId, Constants.arenaCellStates.Food );
    }

    static _GetNextFoodCellId() {
        let vacancies = this._levelContext.vacancies;
        return Array.from( vacancies.cellIdsSet )[Math.floor( Math.random() * vacancies.cellIdsSet.size )];
    }

    static _StartLevel() {
        this._StopClock();
        ViewOutput.ClearArenaMessage();

        if ( this._levelContext.startCountdown == 0 ) {
            this._state = Constants.gameStates.PlayingLevel;
            this._StartClock( () => this._PlayLevel() );
            return;
        }

        ViewOutput.SetArenaMessage( `${this._levelContext.startCountdown}`, Constants.arenaMessageTypes.popup );

        ViewOutput.PlaySound( Constants.soundFxTypes.beep );
        this._levelContext.startCountdown--;
        this._StartClock( () => this._StartLevel(), 1000 );
    }

    static _PlayLevel() {
        this._StopClock();

        let walls = this._levelContext.walls;
        let snake = this._levelContext.snake;
        let food = this._levelContext.food;

        let currentHeadCellId = ViewOutput.GetArenaCellId( snake.headRow, snake.headCol );
        ViewOutput.SetArenaCellState( currentHeadCellId, Constants.arenaCellStates.SnakeBody );

        let lastDirection = snake.direction;
        [snake.direction, snake.headRow, snake.headCol] = this._GetNextSnakePosition();
        if ( lastDirection != snake.direction ) {
            setTimeout( () => ViewOutput.PlaySound( Constants.soundFxTypes.click ), 150 );
        }

        let nextHeadCellId = ViewOutput.GetArenaCellId( snake.headRow, snake.headCol );
        this._levelContext.vacancies.cellIdsSet.delete( nextHeadCellId );

        let snakeHasEatenFood = nextHeadCellId == food.cellId;
        if ( snakeHasEatenFood ) {

            let levelCompleted = food.numRemaining == 1;
            if ( levelCompleted ) {
                let isFinalLevel = this._loadedLevelNum == this._levels.length
                if ( isFinalLevel ) {
                    this._state = Constants.gameStates.Winner;
                    this._PlayEnding( nextHeadCellId );
                    return;
                }
                ViewOutput.PlaySound( Constants.soundFxTypes.victory );
                this._LoadNextLevel();
                return;
            } else {
                ViewOutput.PlaySound( Constants.soundFxTypes.chomp );
            }

            snake.length += snake.growthRate;
            food.numRemaining--;

            this._DecreaseCurrentLevelPeriod();

            food.cellId = this._GetNextFoodCellId();
            ViewOutput.SetArenaCellState( food.cellId, Constants.arenaCellStates.Food );
            ViewOutput.SetHeader( food.numRemaining, Constants.headerMessageTypes.foodHeader );
        }

        let snakeHasDied = snake.cellIdsSet.has( nextHeadCellId ) || walls.cellIdsSet.has( nextHeadCellId );
        if ( snakeHasDied ) {
            // We WANT the player to win. So if they've died, apply subtle increase to starting period
           this._IncreaseStartingLevelPeriod();

            ViewOutput.PlaySound( Constants.soundFxTypes.crunch );

            this._state = Constants.gameStates.LoadingLevel;
            let tailCellId = snake.cellIdsDQueue.shift();
            snake.cellIdsSet.delete( tailCellId );
            this._levelContext.vacancies.cellIdsSet.add( tailCellId );

            ViewOutput.SetArenaCellState( tailCellId, Constants.arenaCellStates.Vacant );
            ViewOutput.SetArenaCellState( nextHeadCellId, Constants.arenaCellStates.SnakeHeadDead );
            ViewOutput.SetArenaMessage( ViewOutput.Messages.youDied, Constants.arenaMessageTypes.popup );

            this._StartClock( () => {
                ViewOutput.SetArenaMessage( ViewOutput.Messages.tryAgain, Constants.arenaMessageTypes.popup );

                this._StartClock( () => {
                    this._StartClock( () => this._LoadLevel() );
                }, 1000 );

            }, 2000 );

            return;
        }

        ViewOutput.SetArenaCellState( nextHeadCellId, Constants.arenaCellStates.SnakeHead );

        if ( snake.length == snake.cellIdsDQueue.length ) {
            let tailCellId = snake.cellIdsDQueue.shift();
            snake.cellIdsSet.delete( tailCellId );
            this._levelContext.vacancies.cellIdsSet.add( tailCellId );
            ViewOutput.SetArenaCellState( tailCellId, Constants.arenaCellStates.Vacant );
        }

        snake.cellIdsSet.add( nextHeadCellId );
        snake.cellIdsDQueue.push( nextHeadCellId );

        let currentPeriod = this._GetCurrentPeriodMs();
        this._StartClock( () => this._PlayLevel(), currentPeriod );
    }

    static _LoadNextLevel() {
        this._state = Constants.gameStates.LoadingLevel;
        this._loadedLevelNum++;
        this._StartClock( () => this._LoadLevel() );
        return;
    }

    static _PlayEnding( lastHeadCellId ) {

        let snake = this._levelContext.snake;

        this._StartClock( () => {
            this._ClearSavedLevelNum();

            ViewOutput.SetArenaMessage( ViewOutput.Messages.youWon, Constants.arenaMessageTypes.popup );

            ViewOutput.SetHeader( ViewOutput.Messages.thanksForPlaying, Constants.headerMessageTypes.messageHeader );
            ViewOutput.ClearHeader( Constants.headerMessageTypes.levelHeader );
            ViewOutput.ClearHeader( Constants.headerMessageTypes.foodHeader );

            ViewOutput.SetArenaCellState( lastHeadCellId, Constants.arenaCellStates.SnakeHead );
            snake.cellIdsSet.add( lastHeadCellId );

            this._StartClock( () => {
                ViewOutput.PlaySound( Constants.soundFxTypes.winner );
                ViewOutput.ClearArenaMessage();
                let arenaCellIds = structuredClone( this._defaultLevelContext.vacancies.cellIdsSet );
                snake.cellIdsSet.forEach( (cellId) => {
                    arenaCellIds.delete(cellId);
                });

                let winnerFunc = () => {
                    let cellId = Array.from(arenaCellIds)[Math.floor( Math.random() * arenaCellIds.size )];

                    ViewOutput.SetArenaCellState( cellId, Constants.arenaCellStates.Food );
                    arenaCellIds.delete( cellId );

                    if ( arenaCellIds.size > 0 ) {
                        this._StartClock( () => winnerFunc(), 10 );
                    }
                };
                this._StartClock( () => winnerFunc() );
            }, 2000)
        } );
    }

    static _GetNextSnakePosition() {

        let nextHeadRow = this._levelContext.snake.headRow;
        let nextHeadCol = this._levelContext.snake.headCol;
        let nextDirection = this._GetNextSnakeDirection();

        switch( nextDirection ) {
            case Constants.directions.North:
                nextHeadRow -= 1;
                break;
            case Constants.directions.East:
                nextHeadCol  += 1;
                break;
            case Constants.directions.South:
                nextHeadRow  += 1;
                break;
            case Constants.directions.West:
                nextHeadCol -= 1;
                break;
        }

        if ( nextHeadRow > Constants.numArenaRows ) {
            nextHeadRow = 1;
        }

        if ( nextHeadRow < 1 ) {
            nextHeadRow = Constants.numArenaRows;
        }

        if ( nextHeadCol > Constants.numArenaCols ) {
            nextHeadCol = 1;
        }

        if ( nextHeadCol < 1 ) {
            nextHeadCol = Constants.numArenaCols;
        }

        return [nextDirection, nextHeadRow, nextHeadCol]
    }

    static _GetNextSnakeDirection() {
        let currentDirection = this._levelContext.snake.direction;
        let nextDirection = this._levelContext.snake.nextDirection;

        // Since the input is async, the next direction could be invalid
        // If that is the case, we should discard and maintain current direction
        switch( currentDirection ) {
            case Constants.directions.North:
            case Constants.directions.South:
                switch( nextDirection ) {
                    case Constants.directions.North:
                    case Constants.directions.South:
                        nextDirection = currentDirection;
                        break;
                }
                break;

            case Constants.directions.East:
            case Constants.directions.West:
                switch( nextDirection ) {
                    case Constants.directions.East:
                    case Constants.directions.West:
                        nextDirection = currentDirection;
                        break;
                }
                break;
        }

        return nextDirection;
    }

    static _SaveLevelNum() {
        if ( localStorage ) {
            localStorage.setItem( Constants.levelNumStorageKey, this._loadedLevelNum );
        }
    }

    static _LoadLevelNum() {

        if( !localStorage ) {
            this._loadedLevelNum = 1;
            return;
        }

        let savedLevelNum = localStorage.getItem( Constants.levelNumStorageKey );
        if ( isNaN( parseInt( savedLevelNum ) ) || savedLevelNum > this._levels.length ) {
            this._loadedLevelNum = 1;
            return;
        }

        this._loadedLevelNum = savedLevelNum;
    }

    static _ClearSavedLevelNum() {
        if ( localStorage ) {
            localStorage.removeItem( Constants.levelNumStorageKey );
        }
    }

}

function Main() {

    if ( document.readyState == 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', ViewInput.OnDomLoaded );
        window.addEventListener( 'load', ViewInput.OnLoad );
    } else {
        ViewInput.OnDomLoaded();
        ViewInput.OnLoad();
    }

    window.addEventListener( 'resize', ViewInput.OnResize );
    window.addEventListener( 'keydown', ViewInput.OnKeyDown );
    window.addEventListener( 'keyup', ViewInput.OnKeyUp );

    let snakeButtonElement = ViewOutput.GetSnakeButtonElement();
    snakeButtonElement.addEventListener( 'mousedown', ViewInput.OnSnakeButtonDown );
    snakeButtonElement.addEventListener( 'mouseup', ViewInput.OnSnakeButtonUp );
    snakeButtonElement.addEventListener( 'touchstart', ViewInput.OnSnakeButtonDown );
    snakeButtonElement.addEventListener( 'touchend', ViewInput.OnSnakeButtonUp );
    snakeButtonElement.addEventListener( 'mouseout', ViewInput.OnSnakeButtonOut );

    ViewOutput.GetTouchpadElement().addEventListener( 'click', ViewInput.OnTouchpadPressed );
}

setTimeout( Main );