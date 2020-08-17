use std::sync::Arc;
use async_graphql::{
    ID,
    Object,
    FieldResult,
};
use anyhow::{
    // anyhow,
    // Result,
    Context as _,
};

use crate::models::{
    VersionedModel,
    // VersionedModelError,
    // VersionedModelResult,
};
use crate::machine::models::{
    Machine,
    MachineStatus,
};

pub struct EStopAndResetMutation;

#[Object]
impl EStopAndResetMutation {
    async fn e_stop<'ctx>(
        &self,
        ctx: &'ctx async_graphql::Context<'_>,
        #[arg(name="machineID")]
        machine_id: ID,
    ) -> FieldResult<Option<bool>> {
        let ctx: &Arc<crate::Context> = ctx.data()?;

        let machine_id = machine_id.parse::<u64>()
            .with_context(|| format!("Invalid machine id: {:?}", machine_id))?;

        Machine::fetch_and_update(&ctx.db, machine_id, |machine| machine.map(|mut machine| {
            machine.status = MachineStatus::Stopped;
            machine.stop_counter += 1;

            machine
        }))?;

        Ok(None)
    }

    async fn reset<'ctx>(
        &self,
        ctx: &'ctx async_graphql::Context<'_>,
        #[arg(name="machineID")]
        machine_id: ID,
    ) -> FieldResult<Option<bool>> {
        let ctx: &Arc<crate::Context> = ctx.data()?;

        let machine_id = machine_id.parse::<u64>()
            .with_context(|| format!("Invalid machine id: {:?}", machine_id))?;

        Machine::fetch_and_update(&ctx.db, machine_id, |machine| machine.map(|mut machine| {
            machine.reset_counter += 1;

            machine
        }))?;

        Ok(None)
    }
}
