import ObstacleBulletManager from "./obstacle_bullet_manager";
import ObstacleMoveManager from "./obstacle_move_manager";

export default class ObstacelManager {
    private obstacleBulletManager: ObstacleBulletManager;
    private obstacleMoveManger: ObstacleMoveManager;

    constructor(obstacleBulletManager: ObstacleBulletManager, obstacleMoveManager: ObstacleMoveManager) {
        this.obstacleBulletManager = obstacleBulletManager;
        this.obstacleMoveManger = obstacleMoveManager;
    }

    update(delta: number) {
        for (let i = 0; i < this.obstacleMoveManger.listObstacle.length ; ++i) {
            for (let j = 0; j < this.obstacleBulletManager.listBullet.length; ++j) {
                if (this.obstacleMoveManger.listObstacle[i].obstacle.collider.checkCollision(this.obstacleBulletManager.listBullet[j].collider)) {
                    console.log("Check collision move - bullet");

                    delta

                }
            }
        }
    }
}