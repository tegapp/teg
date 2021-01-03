use anyhow::{
    anyhow,
    Result,
    // Context as _,
};

use crate::{
    components::{
        Controller,
        ControllerConfig,
        SpeedController,
        SpeedControllerConfig,
        Toolhead,
        ToolheadConfig,
        Video,
        VideoConfig
    },
    machine::Machine,
};

use super::ResetWhenIdle;

#[xactor::message(result = "Result<()>")]
pub struct CreateComponent {
    pub component_type: String,
    pub model: serde_json::Value,
}

#[async_trait::async_trait]
impl xactor::Handler<CreateComponent> for Machine {
    async fn handle(&mut self, ctx: &mut xactor::Context<Self>, msg: CreateComponent) -> Result<()> {
        let data = self.get_data()?;

        let model = msg.model;

        match &msg.component_type[..] {
            "CONTROLLER" => {
                let config: ControllerConfig = serde_json::from_value(model)?;
                let component = Controller::new(config);
                data.config.controllers.push(component)
            }
            "TOOLHEAD" => {
                let config: ToolheadConfig = serde_json::from_value(model)?;
                let component = Toolhead::new(config);
                data.config.toolheads.push(component);
            }
            "SPEED_CONTROLLER" => {
                let config: SpeedControllerConfig = serde_json::from_value(model)?;
                let component = SpeedController::new(config);
                data.config.speed_controllers.push(component);
            }
            "VIDEO" => {
                let config: VideoConfig = serde_json::from_value(model)?;
                let component = Video::new(config);
                data.config.videos.push(component);
            }
            _ => Err(anyhow!("Invalid component type: {}", msg.component_type))?,
        };

        data.config.save_config().await?;
        ctx.address().send(ResetWhenIdle)?;

        Ok(())
    }
}
