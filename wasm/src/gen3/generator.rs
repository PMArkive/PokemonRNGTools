use super::settings::Settings;
use crate::enums::{self, Shiny};
use crate::rng::Lcrng;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub struct Pokemon {
    pub shiny: enums::Shiny,
    pub pid: u32,
    pub nature: enums::Nature,
    pub ivs: Vec<u16>,
    pub ability: enums::Ability,
    pub gender: enums::Gender,
    pub encounter: u8,
    pub is_synch: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct Result {
    pub rng_state: u32,
    pub advances: usize,
    pub shiny_value: enums::Shiny,
    pub pid: u32,
    pub nature: enums::Nature,
    pub ivs: Vec<u16>,
    pub ability: enums::Ability,
    pub gender: enums::Gender,
    pub encounter: u8,
    pub is_synch: bool,
}

type IVs = Vec<u16>;
fn check_ivs(ivs: &IVs, min_ivs: &IVs, max_ivs: &IVs) -> bool {
    ivs.iter()
        .zip(min_ivs.iter())
        .zip(max_ivs.iter())
        .all(|((iv, min), max)| min <= iv && iv <= max)
}

pub fn generate_pokemon(mut rng: Lcrng, settings: &Settings) -> Option<Pokemon> {
    rng.next_u32(); // unknown

    // encounter slot
    let encounter_rand = rng.next_u16() % 100;

    rng.next_u32();

    let nature_rand;
    let mut is_synch = false;

    match settings.lead_filter {
        enums::LeadFilter::None => {
            nature_rand = rng.next_u16() % 25;
        }
        enums::LeadFilter::Synchronize => {
            if (rng.next_u16() & 1) == 0 {
                // if synchronized, nature set doesn't matter
                nature_rand = 0;
                is_synch = true;
            } else {
                nature_rand = rng.next_u16() % 25;
            }
        }
        _ => nature_rand = 0,
    };

    let nature = enums::Nature::try_from(nature_rand as u16).unwrap_or(enums::Nature::Hardy);

    let natures: Vec<enums::NatureFilter> = settings
        .nature_filter
        .iter()
        .map(|nature| {
            enums::NatureFilter::try_from(*nature as u16).unwrap_or(enums::NatureFilter::Hardy)
        })
        .collect();

    if !natures.iter().any(|nat| *nat == nature) {
        return None;
    }

    let mut pid: u32;
    loop {
        let pid_low = rng.next_u16() as u32;
        let pid_high = rng.next_u16() as u32;
        pid = (pid_high << 16) | pid_low;
        if pid % 25 == nature_rand as u32 {
            break;
        }
    }

    let tsv = (settings.tid ^ settings.sid) as u16;

    let shiny = Shiny::calculate_shiny_gen3(pid, tsv);

    if settings.shiny_filter != shiny {
        return None;
    }

    let ability_rand = pid & 1;

    let ability = enums::Ability::try_from(ability_rand as u32).unwrap_or(enums::Ability::Ability0);

    if settings.ability_filter != ability {
        return None;
    }

    let gender_rand = pid & 255;

    let gender = match enums::get_set_gender_from_ratio(&settings.gender_ratio) {
        Some(set_gender) => set_gender,
        None => enums::get_gender_from_ratio(&settings.gender_ratio, gender_rand.into()),
    };

    if settings.gender_filter != gender {
        return None;
    }

    let iv1;
    let iv2;

    match settings.method_filter {
        enums::MethodFilter::MethodH1 => {
            iv1 = rng.next_u16();
            iv2 = rng.next_u16();
        }
        enums::MethodFilter::MethodH2 => {
            rng.next_u16();
            iv1 = rng.next_u16();
            iv2 = rng.next_u16();
        }
        _ => {
            iv1 = rng.next_u16();
            rng.next_u16();
            iv2 = rng.next_u16();
        }
    };

    let mut ivs = vec![32, 32, 32, 32, 32, 32];

    ivs[0] = iv1 & 0x1f;
    ivs[1] = (iv1 >> 5) & 0x1f;
    ivs[2] = (iv1 >> 10) & 0x1f;
    ivs[3] = (iv2 >> 5) & 0x1f;
    ivs[4] = (iv2 >> 10) & 0x1f;
    ivs[5] = iv2 & 0x1f;

    if !check_ivs(&ivs, &settings.min_ivs, &settings.max_ivs) {
        return None;
    }

    let encounter_slots: [u16; 12] = [20, 40, 50, 60, 70, 80, 85, 90, 94, 98, 99, 100];

    let encounter = encounter_slots
        .iter()
        .position(|enc| encounter_rand < *enc)
        .unwrap_or(0) as u8;

    let encounters: Vec<enums::EncounterSlotFilter> = settings
        .encounter_filter
        .iter()
        .map(|encounter| {
            enums::EncounterSlotFilter::try_from(*encounter)
                .unwrap_or(enums::EncounterSlotFilter::Slot0)
        })
        .collect();

    if !encounters.iter().any(|slot| *slot == encounter) {
        return None;
    }

    Some(Pokemon {
        shiny,
        pid: pid.into(),
        nature,
        ivs,
        ability,
        gender,
        encounter,
        is_synch,
    })
}

pub fn generate_wild(settings: Settings) -> Vec<Result> {
    let mut rng = Lcrng::from_state(settings.rng_state);
    rng.advance(settings.delay);
    let mut results: Vec<Result> = Vec::new();
    let values = settings.min_advances..=settings.max_advances;
    rng.advance(settings.min_advances);

    for value in values {
        let generate_result = generate_pokemon(rng, &settings);
        if let Some(pokemon) = generate_result {
            let rng_state = rng.get_state();
            let result = Result {
                rng_state,
                advances: value,
                pid: pokemon.pid,
                shiny_value: pokemon.shiny,
                nature: pokemon.nature,
                ivs: pokemon.ivs,
                ability: pokemon.ability,
                gender: pokemon.gender,
                encounter: pokemon.encounter,
                is_synch: pokemon.is_synch,
            };
            results.push(result);
        }

        rng.next();
    }

    results.into_iter().collect()
}

#[cfg(test)]
mod test {
    use super::*;
    use std::vec;

    #[test]
    fn should_generate_pokemon() {
        let mut rng = Lcrng::from_state(0);
        let settings = Settings {
            nature_filter: vec![25],
            encounter_filter: vec![12],
            rng_state: 0,
            delay: 0,
            min_advances: 0,
            max_advances: 10,
            gender_ratio: enums::GenderRatio::Male50Female50,
            lead_filter: enums::LeadFilter::None,
            shiny_filter: enums::ShinyFilter::None,
            ability_filter: enums::AbilityFilter::Any,
            gender_filter: enums::GenderFilter::Any,
            min_ivs: vec![0, 0, 0, 0, 0, 0],
            max_ivs: vec![31, 31, 31, 31, 31, 31],
            tid: 0,
            sid: 0,
            method_filter: enums::MethodFilter::MethodH1,
        };

        let expected_results = vec![
            Pokemon {
                shiny: enums::Shiny::None,
                pid: 0x60A1E414,
                nature: enums::Nature::Calm,
                ivs: vec![11, 25, 10, 25, 3, 24],
                ability: enums::Ability::Ability0,
                gender: enums::Gender::Female,
                encounter: 5,
                is_synch: false,
            },
            Pokemon {
                shiny: enums::Shiny::None,
                pid: 0x639E3D69,
                nature: enums::Nature::Bashful,
                ivs: vec![9, 9, 7, 20, 26, 13],
                ability: enums::Ability::Ability1,
                gender: enums::Gender::Female,
                encounter: 0,
                is_synch: false,
            },
        ];

        for (advance, expected_result) in expected_results.iter().enumerate() {
            let result = generate_pokemon(rng.clone(), &settings);

            assert_eq!(
                result.as_ref(),
                Some(expected_result),
                "Mismatch on advance {}",
                advance
            );
            rng.next();
        }
    }
}
