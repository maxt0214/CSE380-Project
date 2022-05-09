import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameLevel from "./GameLevel";
import HomeScreen from "./HomeScreen";

//EndLevel to only play end music. Then transit back to Homescreen
export default class EndLevel extends GameLevel {

    loadScene(): void {
        this.load.audio("level_music", "project_assets/music/end.mp3");
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        super.initLayers();
        super.initViewport();
        //Center view port
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        //Wining text
        let levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(size.x, size.y), text: "You Won! Our New Champion!"});
        levelEndLabel.size.set(600, 60);
        levelEndLabel.borderRadius = 0;
        levelEndLabel.backgroundColor = new Color(34, 32, 52);
        levelEndLabel.textColor = Color.WHITE;
        levelEndLabel.fontSize = 48;
        levelEndLabel.font = "PixelSimple";

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(size.x + 320, size.y - 320), text: "Back"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.textColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";

        // When the skip button is clicked, back to home screen
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {}, {});
        }
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
    }
}