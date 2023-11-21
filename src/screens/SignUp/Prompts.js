import { StyleSheet, Text, SafeAreaView } from 'react-native'
import React,{useLayoutEffect, useState} from 'react'
import colors from '../../styles/colors'
import FormWrapper from '../../components/wrappers/formWrappers/FormWrapper'
import PromptIntro from '../../components/screenComponents/swiping/Prompts/PromptIntro'
import PublicPrompts from '../../components/screenComponents/swiping/Prompts/PublicPrompts'
import PrivatePrompts from '../../components/screenComponents/swiping/Prompts/PrivatePrompts'
import ReferralCode from '../../components/screenComponents/swiping/Prompts/ReferralCode'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { apiUrl } from '../../constants'
import { setPromptFillingStart, setSessionExpired } from '../../store/reducers/authentication/authentication'
import {
    setAllPrompts,
  } from "../../store/reducers/allData/allData";
import Loader from '../../components/loader/Loader'

const Prompts = () => {

  const dispatch = useDispatch()
  
  const [all_prompts, setall_prompts] = useState([])

  const [prompts_list_rmv, setprompts_list_rmv] = useState([]);

  const [promptStep, setpromptStep] = useState(1);
  const [public_prompt1_a, setpublic_prompt1_a] = useState("");
  const [public_prompt1_q, setpublic_prompt1_q] = useState("");
  const [public_prompt2_a, setpublic_prompt2_a] = useState("");
  const [public_prompt2_q, setpublic_prompt2_q] = useState("");
  const [private_prompt1_a, setprivate_prompt1_a] = useState("");
  const [private_prompt1_q, setprivate_prompt1_q] = useState("");
  const [private_prompt2_a, setprivate_prompt2_a] = useState("");
  const [private_prompt2_q, setprivate_prompt2_q] = useState("");
  const [loading, setloading] = useState(false)

  const getPrompts = async () => {

    setloading(true);
    await axios
      .get(apiUrl + "getactiveprompts/")
      .then((resp) => {
        
        setloading(false);
        let resp_data = resp.data;
        console.log("prompts resp.data.code",resp.data.code)
        if (resp.data.code == 200) {
          let act_prompts = resp_data.data.filter((c) => c.is_active == true);
          let act_promptsm = act_prompts.map((c) => [c.id, c.prompts]);
          console.log("act_promptsm",act_promptsm.length)
          setall_prompts(act_prompts)
          dispatch(setAllPrompts(act_promptsm));
        } else if (resp.data.code == 401) {
          dispatch(setSessionExpired(true));
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };


  useLayoutEffect(() => {
    getPrompts()   
  }, [])

  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.white}}>

      {loading && <Loader/>}
      {promptStep == 1 ? (
            <PromptIntro setpromptStep={setpromptStep} />)
            :
            promptStep == 2 ? (
                <PublicPrompts
                  public_prompt1_q={public_prompt1_q}
                  setpublic_prompt1_q={setpublic_prompt1_q}
                  public_prompt1_a={public_prompt1_a}
                  setpublic_prompt1_a={setpublic_prompt1_a}
                  public_prompt2_q={public_prompt2_q}
                  setpublic_prompt2_q={setpublic_prompt2_q}
                  public_prompt2_a={public_prompt2_a}
                  setpublic_prompt2_a={setpublic_prompt2_a}
                  prompts_list_rmv={prompts_list_rmv}
                  setprompts_list_rmv={setprompts_list_rmv}
                  prompts_list={all_prompts}
                  setpromptStep={setpromptStep}
                />
              )
              : promptStep == 3 ? (
                <PrivatePrompts
                  private_prompt1_q={private_prompt1_q}
                  setprivate_prompt1_q={setprivate_prompt1_q}
                  private_prompt1_a={private_prompt1_a}
                  setprivate_prompt1_a={setprivate_prompt1_a}
                  private_prompt2_q={private_prompt2_q}
                  setprivate_prompt2_q={setprivate_prompt2_q}
                  private_prompt2_a={private_prompt2_a}
                  setprivate_prompt2_a={setprivate_prompt2_a}
                  prompts_list_rmv={prompts_list_rmv}
                  setprompts_list_rmv={setprompts_list_rmv}
                  prompts_list={all_prompts}
                  setpromptStep={setpromptStep}
                />
              )
            :
            <ReferralCode
              public_prompt1_q={public_prompt1_q}
              setpublic_prompt1_q={setpublic_prompt1_q}
              public_prompt1_a={public_prompt1_a}
              setpublic_prompt1_a={setpublic_prompt1_a}
              public_prompt2_q={public_prompt2_q}
              setpublic_prompt2_q={setpublic_prompt2_q}
              public_prompt2_a={public_prompt2_a}
              setpublic_prompt2_a={setpublic_prompt2_a}
              private_prompt1_q={private_prompt1_q}
              setprivate_prompt1_q={setprivate_prompt1_q}
              private_prompt1_a={private_prompt1_a}
              setprivate_prompt1_a={setprivate_prompt1_a}
              private_prompt2_q={private_prompt2_q}
              setprivate_prompt2_q={setprivate_prompt2_q}
              private_prompt2_a={private_prompt2_a}
              setprivate_prompt2_a={setprivate_prompt2_a}
              setpromptStep={setpromptStep}
            />
      }

    </SafeAreaView>
  )
}

export default Prompts

const styles = StyleSheet.create({})