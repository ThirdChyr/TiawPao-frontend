import React, { useState, useCallback ,useEffect} from 'react';
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedCustomBackButton from "@/components/ThemeCustomBackButton";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  useColorScheme,
  Image,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  ArrowRightToLine,
  PlusCircle,
  Plus,
  Minus,
} from "@tamagui/lucide-icons";
import { XStack, YStack, Button, ScrollView } from "tamagui";
import { ImageBackground } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import Bgelement from "@/components/Bgelement";
import { ThemedText } from "@/components/ThemedText";
import SelectedCompo from "@/components/selectedbutton";
import { widths } from "@tamagui/config/types/media";
import apiTAT from "@/utils/axiosTATInstance";
import { auth } from "@/config/firebaseconfig";
import uuid from "react-native-uuid";
import { useUserStore } from "@/store/useUser";
import api from "@/utils/axiosInstance";

export default function Main() {
  const { addUserPlanId, user } = useUserStore();
  const theme = useColorScheme();
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [slot, setslot] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [triptype, setTriptype] = useState("");
  const [max,setmax] = useState(2)
  const [Mustsee, setmustsee] = useState(false);
  const [Nature, setNature] = useState(false);
  const [Eco, setEco] = useState(false);
  const [ArtAndthea, setArtAndthea] = useState(false);
  const [Beach, setBeach] = useState(false);
  const [Adventure, setAdventure] = useState(false);
  const [Camping, setCamping] = useState(false);
  const [Urban, setUrban] = useState(false);
  const [Rural, setRural] = useState(false);
  const [Luxury, setLuxury] = useState(false);
  const [LocalCul, setLocalCul] = useState(false);
  const [Foodie, setFoodie] = useState(false);
  const [Shopping, setShopping] = useState(false);
  const param = useLocalSearchParams();
  let {
    tripName,
    region,
    province,
    startDate,
    startTime,
    endDate,
    endTime,
    visibility,
    description,
  } = param;
  const vibeslock = () => {
    //console.log(Mustsee||Nature||Eco||ArtAndthea||Beach||Adventure||Camping||Urban||Rural||Luxury||LocalCul||Foodie||Shopping);
    return (
      Mustsee ||
      Nature ||
      Eco ||
      ArtAndthea ||
      Beach ||
      Adventure ||
      Camping ||
      Urban ||
      Rural ||
      Luxury ||
      LocalCul ||
      Foodie ||
      Shopping
    );
  };
  const Submit_Button = () => {
    const provinceMap: Record<number, string> = {
      571: "Amnat Charoen",
      218: "Ang Thong",
      219: "Bangkok",
      590: "Bueng Kan",
      572: "Buri Ram",
      220: "Chachoengsao",
      221: "Chainat",
      573: "Chaiyaphum",
      463: "Chanthaburi",
      101: "Chiang Mai",
      102: "Chiang Rai",
      464: "Chon Buri",
      343: "Chumphon",
      574: "Kalasin",
      103: "Kamphaeng Phet",
      222: "Kanchanaburi",
      575: "Khon Kaen",
      344: "Krabi",
      104: "Lampang",
      105: "Lamphun",
      576: "Loei",
      223: "Lop Buri",
      106: "Mae Hong Son",
      577: "Maha Sarakham",
      578: "Mukdahan",
      224: "Nakhon Nayok",
      225: "Nakhon Pathom",
      579: "Nakhon Phanom",
      580: "Nakhon Ratchasima",
      107: "Nakhon Sawan",
      345: "Nakhon Si Thammarat",
      108: "Nan",
      346: "Narathiwat",
      581: "Nong Bua Lam Phu",
      582: "Nong Khai",
      226: "Nonthaburi",
      227: "Pathum Thani",
      347: "Pattani",
      348: "Phang Nga",
      349: "Phatthalung",
      109: "Phayao",
      110: "Phetchabun",
      228: "Phetchaburi",
      111: "Phichit",
      112: "Phitsanulok",
      229: "Phra Nakhon Si Ayutthaya",
      113: "Phrae",
      350: "Phuket",
      230: "Prachin Buri",
      231: "Prachuap Khiri Khan",
      351: "Ranong",
      232: "Ratchaburi",
      465: "Rayong",
      583: "Roi Et",
      233: "Sa Kaeo",
      584: "Sakon Nakhon",
      234: "Samut Prakan",
      235: "Samut Sakhon",
      236: "Samut Songkhram",
      237: "Saraburi",
      352: "Satun",
      585: "Si Sa Ket",
      238: "Sing Buri",
      353: "Songkhla",
      114: "Sukhothai",
      239: "Suphan Buri",
      354: "Surat Thani",
      586: "Surin",
      115: "Tak",
      355: "Trang",
      466: "Trat",
      587: "Ubon Ratchathani",
      588: "Udon Thani",
      116: "Uthai Thani",
      117: "Uttaradit",
      356: "Yala",
      589: "Yasothon",
    };
    const getProvinceId = (provinceName: string): number | undefined => {
      const foundKey = Object.keys(provinceMap).find(
        (key) => provinceMap[Number(key)] === provinceName
      );
      return foundKey ? Number(foundKey) : undefined;
    };
    const Gototrip = async () => {
      if (triptype === "")
      {
        Alert.alert("Warning", "Please select Travelers type!");
        return;
      }
      if (selectedTrip === null || !vibeslock()) {
        Alert.alert("Warning", "Please select your travel vibes!");
        return;
      }

      if (adults === 0 && kids === 0) {
        Alert.alert("Warning", "Please select your number of Travelers!");
        return;
      }

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not logged in");
        }

        const idToken = await currentUser.getIdToken();

        const planID = uuid.v4();

        const dataJson = {
          plan_id: planID,
          author_email: user.email,
          author_img: user.image,
          author_name: user.username,
          description: description,
          trip_name: tripName,
          region_label: region,
          province_label: province,
          province_id: String(getProvinceId(province?.toString() || "") || ""),
          start_date: startDate?.toString(),
          start_time: startTime?.toString(),
          end_date: endDate?.toString(),
          end_time: endTime?.toString(),
          trip_location: [],
          visibility: visibility === "Public",
          created_by:"AI"
        };

        const response = await api.post(`/user/createplan`, dataJson, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        addUserPlanId(planID);

        console.log("flow this");

        router.push({
          pathname: "/(tabs)/add/aiservice",
          params: {
            planID: planID,
            tripName: tripName,
            region: region,
            province: province,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            visibility: visibility,
            peopletype: triptype,
            description: description,
            isMust: Mustsee?.toString(),
            isNature: Nature?.toString(),
            isEcoL: Eco?.toString(),
            isArt: ArtAndthea?.toString(),
            isBeach: Beach?.toString(),
            isaAdventure: Adventure?.toString(),
            isCamping: Camping?.toString(),
            isUrban: Urban?.toString(),
            isRural: Rural?.toString(),
            isLux: Luxury?.toString(),
            isLocal: LocalCul?.toString(),
            isFood: Foodie?.toString(),
            isShop: Shopping?.toString(),
            kids: kids,
            adults: adults,
          },
        });
      } catch (error) {
        console.error("Error creating trip:", error);
        Alert.alert("Error", "Failed to create trip. Please try again.");
      }
    };
    console.log("flow this");
    Gototrip();
    console.log("Sucess!!!");
  };
  const Return_Button = () => {
    const theme = useColorScheme();
    const BacktoAdd = () => {
      router.push({
        pathname: "/(tabs)/add/introgenai",
        params: {
          tripName: tripName,
          region: region,
          province: province,
          startDate: startDate,
          description:description,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          visibility: visibility,
        },
      });
    };
    return (
      <Pressable onPress={BacktoAdd}>
        <MaterialIcons
          name="arrow-back"
          size={30}
          color={theme == "dark" ? "#fff" : "#203B82"}
        />
      </Pressable>
    );
  };
  const TypeTripRender = () => {
    const handleToggle = (state: boolean, tripType: string) => {
      if (state) {
        setSelectedTrip(tripType);
        setTriptype(tripType);
        console.log(triptype);
      } else {
        setSelectedTrip(null);
      }
    };
    return (
      <YStack>
        <XStack style={styles.XstackFourSelect}>
          <SelectedCompo
            title="Solo Trip"
            width={115}
            marginleft={30}
            marginright={0}
            logo="User"
            onToggle={(state) => handleToggle(state, "Solo")}
            isSelected={selectedTrip === "Solo"}
            disabled={selectedTrip !== null && selectedTrip !== "Solo"}
          />
          <SelectedCompo
            title="Partner Trip"
            width={138}
            marginleft={40}
            marginright={0}
            logo="Heart"
            onToggle={(state) => handleToggle(state, "Partner")}
            isSelected={selectedTrip === "Partner"}
            disabled={selectedTrip !== null && selectedTrip !== "Partner"}
          />
        </XStack>
        <XStack style={styles.XstackFourSelect}>
          <SelectedCompo
            title="Friends Trip"
            width={138}
            marginleft={30}
            marginright={0}
            logo="Users2"
            onToggle={(state) => handleToggle(state, "Friends")}
            isSelected={selectedTrip === "Friends"}
            disabled={selectedTrip !== null && selectedTrip !== "Friends"}
          />
          <SelectedCompo
            title="Family Trip"
            width={138}
            marginleft={20}
            marginright={0}
            logo="House"
            onToggle={(state) => handleToggle(state, "Family")}
            isSelected={selectedTrip === "Family"}
            disabled={selectedTrip !== null && selectedTrip !== "Family"}
          />
        </XStack>
      </YStack>
    );
  };
  const SelectedVibs = () => {
    const handleToggle = (state: boolean, tripType: string) => {
      // console.log("state is ",state);
      if (tripType === "must") {
        setmustsee(state);
        //console.log("Logic must = ",Mustsee);
      } else if (tripType === "nature") {
        setNature(state);
        //console.log("Logic Nature = ",Nature);
      } else if (tripType === "eco") {
        setEco(state);
        // console.log("Logic Eco = ",Eco);
      } else if (tripType === "art") {
        setArtAndthea(state);
        //console.log("Logic ArtAndthea = ",ArtAndthea);
      } else if (tripType === "beach") {
        setBeach(state);
        // console.log("Logic Beach = ",Beach);
      } else if (tripType === "adventure") {
        setAdventure(state);
        //console.log("Logic Adventure = ",Adventure);
      } else if (tripType === "camping") {
        setCamping(state);
        //console.log("Logic Camping = ",Camping);
      } else if (tripType === "urban") {
        setUrban(state);
        //console.log("Logic Urban = ",Urban);
      } else if (tripType === "rural") {
        setRural(state);
        //console.log("Logic Rural = ",Rural);
      } else if (tripType === "luxury") {
        setLuxury(state);
        //console.log("Logic Luxury = ",Luxury);
      } else if (tripType === "local") {
        setLocalCul(state);
        //console.log("Logic local = ",LocalCul);
      } else if (tripType === "foodie") {
        setFoodie(state);
        //console.log("Logic Foodie = ",Foodie);
      } else if (tripType === "shopping") {
        setShopping(state);
        //console.log("Logic Shopping = ",Shopping);
      }
    };
    return (
      <YStack style={styles.YstackVibs}>
        <XStack style={styles.XstackVibs}>
          <SelectedCompo
            width={157}
            title="Must see attraction"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "must")}
            isSelected={Mustsee}
            disabled={LocalCul}
          />
          <SelectedCompo
            width={75}
            title="Nature"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "nature")}
            isSelected={Nature}
          />
          <SelectedCompo
            width={100}
            title="Ecotourism"
            marginleft={0}
            marginright={0}
            logo="no"
            onToggle={(state) => handleToggle(state, "eco")}
            isSelected={Eco}
            disabled={Luxury}
          />
        </XStack>
        <XStack style={styles.XstackVibs}>
          <SelectedCompo
            width={115}
            title="Art & Theater"
            marginleft={0}
            marginright={21}
            logo="no"
            disabled={false}
            onToggle={(state) => handleToggle(state, "art")}
            isSelected={ArtAndthea}
          />
          <SelectedCompo
            width={67}
            title="Beach"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "beach")}
            isSelected={Beach}
          />
          <SelectedCompo
            width={96}
            title="Adventure"
            marginleft={0}
            marginright={0}
            logo="no"
            onToggle={(state) => handleToggle(state, "adventure")}
            isSelected={Adventure}
          />
        </XStack>
        <XStack style={styles.XstackVibs}>
          <SelectedCompo
            width={87}
            title="Camping"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "camping")}
            isSelected={Camping}
          />
          <SelectedCompo
            width={72}
            title="Urban"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "urban")}
            isSelected={Urban}
            disabled={Rural}
          />
          <SelectedCompo
            width={60}
            title="Rural"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "rural")}
            isSelected={Rural}
            disabled={Urban}
          />
          <SelectedCompo
            width={72}
            title="Luxury"
            marginleft={0}
            marginright={0}
            logo="no"
            onToggle={(state) => handleToggle(state, "luxury")}
            isSelected={Luxury}
            disabled={Eco}
          />
        </XStack>
        <XStack style={styles.XstackVibs}>
          <SelectedCompo
            width={115}
            title="Local Culture"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "local")}
            isSelected={LocalCul}
            disabled={Mustsee}
          />
          <SelectedCompo
            width={75}
            title="Foodie"
            marginleft={0}
            marginright={21}
            logo="no"
            onToggle={(state) => handleToggle(state, "foodie")}
            isSelected={Foodie}
          />
          <SelectedCompo
            width={90}
            title="Shopping"
            marginleft={0}
            marginright={0}
            logo="no"
            onToggle={(state) => handleToggle(state, "shopping")}
            isSelected={Shopping}
          />
        </XStack>
      </YStack>
    );
  };
  useEffect(() => {
  if (selectedTrip === "Solo") {
    setmax(1);
    setslot(0);
    setAdults(0);
    setKids(0);
  } else if (selectedTrip === "Partner") {
    setmax(2);
    setAdults(0);
    setslot(0);
    setKids(0);
  } else if (selectedTrip === "Friends" || selectedTrip === "Family") {
    setmax(999);
    setAdults(0);
    setslot(0);
    setKids(0);
  }
}, [selectedTrip]);
  const AgeRender = () => {
   const update_value = (key: string, where: string) => {
  if (selectedTrip === null) {
    Alert.alert("Warning", "Please select trip type first!");
    return;
  }
  
 if ((key === "adults") && (slot < max || where !== "plus")) {
   setAdults((prev) => Math.max(0, prev + (where === "plus" ? 1 : -1)));
   setslot((prev) => Math.max(0, prev + (where === "plus" ? 1 : -1)));
  } else if ((key === "kid") && (slot < max || where !== "plus")) {
   setKids((prev) => Math.max(0, prev + (where === "plus" ? 1 : -1)));
   setslot((prev) => Math.max(0, prev + (where === "plus" ? 1 : -1)));
   
  }
};
    return (
      <YStack>
        <XStack style={styles.XStackTraveler}>
          <YStack>
            <ThemedText style={styles.TextTraveler}>Adults</ThemedText>
            <ThemedText style={styles.TextSubTravler}>Age up to 17</ThemedText>
          </YStack>
          <XStack style={styles.xStackUpandDown}>
            <Pressable style={styles.ButtonTwin}>
              <Minus
                size={35}
                color={"white"}
                style={{
                  backgroundColor: "#203B82",
                  borderRadius: 50,
                  marginLeft: -10,
                }}
                onPress={() => update_value("adults", "no")}
              />
            </Pressable>
            <ThemedText style={styles.TextNumber}> {adults} </ThemedText>
            <Pressable style={styles.ButtonTwin}>
              <Plus
                size={35}
                color={"white"}
                style={{ backgroundColor: "#203B82", borderRadius: 50 }}
                onPress={() => update_value("adults", "plus")}
              />
            </Pressable>
          </XStack>
        </XStack>

        <XStack style={styles.XStackTraveler}>
          <YStack>
            <ThemedText style={styles.TextTraveler}>Children</ThemedText>
            <ThemedText style={styles.TextSubTravler}>Age 3-17</ThemedText>
          </YStack>
          <XStack style={styles.xStackUpandDown}>
            <Pressable style={styles.ButtonTwin}>
              <Minus
                size={35}
                color={"white"}
                style={{
                  backgroundColor: "#203B82",
                  borderRadius: 50,
                  marginLeft: -10,
                }}
                onPress={() => update_value("kid", "no")}
              />
            </Pressable>
            <ThemedText style={styles.TextNumber}> {kids} </ThemedText>
            <Pressable style={styles.ButtonTwin}>
              <Plus
                size={35}
                color={"white"}
                style={{ backgroundColor: "#203B82", borderRadius: 50 }}
                onPress={() => update_value("kid", "plus")}
              />
            </Pressable>
          </XStack>
        </XStack>
      </YStack>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.ThemeView}>
        <Bgelement />
        <XStack style={styles.XStackReturnButton}>
          <Return_Button />
        </XStack>
        <YStack style={styles.YStackAllComponent}>
          <YStack style={styles.YStackNameTrip}>
            <ThemedText style={[styles.TextHeader, { fontWeight: "bold" }]}>
              {tripName}
            </ThemedText>
          </YStack>
          <ScrollView style={{ flex: 1 }}>
            <YStack style={styles.YStackRenderContent}>
              <YStack>
                <ThemedText style={styles.TextSubScript}>
                  What kind of trip are you planning?
                </ThemedText>
                {TypeTripRender()}
                <ThemedText style={styles.TextSubScript}>
                  What your travel vibes?
                </ThemedText>
                <ScrollView style={{ flexDirection: "row" }}>
                  {SelectedVibs()}
                </ScrollView>
                <ThemedText style={styles.TextSubScript}>
                  Number of traveler
                </ThemedText>
                {AgeRender()}
              </YStack>
              <YStack style={{ marginTop: 30 }}>
                <Button
                  style={{ backgroundColor: "#10b981" }}
                  onPress={Submit_Button}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Submit
                  </Text>
                </Button>
                <Button style={{ backgroundColor: "transparent" }}></Button>
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = {
  ThemeView: {
    flex: 1,
  },
  XStackReturnButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 20,
    //backgroundColor: 'red',
  },
  YStackAllComponent: {
    flex: 1,
    backgroundColor: "tranparent",
    widths: "100%",
    heights: "100%",
    marginHorizontal: 10,
  },
  YStackNameTrip: {
    widths: "100%",
    heights: "100",
    backgroundColor: "tranparent",
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  YStackRenderContent: {
    // justifyContent: 'space-between',
  },
  XstackFourSelect: {
    backgroundColor: "tranparent",
    justifyContent: "left",
    alignItems: "center",
    marginBottom: 20,

    //marginLeft:'20',
  },
  XstackVibs: {
    widths: "100%",
    //backgroundColor : 'red',
    marginLeft: 10,
    marginBottom: 10,
  },
  XStackTraveler: {
    widths: "100%",
    // backgroundColor : 'red',
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  xStackUpandDown: {
    alignItems: "center",
  },
  YstackVibs: {
    //backgroundColor : 'green',
  },
  TextHeader: {
    fontSize: 32,
  },
  ButtonTwin: {
    borderRadius: 50,
    width: 40,
    height: 40,
    bcakgroundColor: "black",
  },
  TextNumber: {
    fontSize: 18,
    minWidth: 30,
  },
  TextSubScript: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  TextTraveler: {
    fontSize: 16,
    marginLeft: 10,
  },
  TextSubTravler: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: -5,
    color: "#909090",
  },
};
