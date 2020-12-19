use serde::{Serialize, Deserialize};

mod axis;
pub use axis::*;

mod build_platform;
pub use build_platform::*;

mod heater;
pub use heater::*;

mod speed_controller;
pub use speed_controller::*;

mod toolhead;
pub use toolhead::*;

mod video;
pub use video::*;

mod controller;
pub use controller::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ComponentInner<Model, Ephemeral: Default> {
    pub id: u64,
    pub model_version: u64,
    pub model: Model,
    #[serde(skip)]
    pub ephemeral: Ephemeral,
}
