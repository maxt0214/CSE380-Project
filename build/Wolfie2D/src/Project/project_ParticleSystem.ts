import Particle from "../Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "../Wolfie2D/Rendering/Animations/ParticleSystem";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
import RandUtils from "../Wolfie2D/Utils/RandUtils";

export default class Project_ParticleSystem extends ParticleSystem {

    setParticleAnimation(particle: Particle) {
        //TODO:change this particle
        particle.vel = RandUtils.randVec(-50, 50, 0 * particle.mass, 200 * particle.mass);
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }
}