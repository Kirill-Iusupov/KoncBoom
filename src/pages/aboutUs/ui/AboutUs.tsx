import { Wrapper } from "@/src/shared/ui/Wrapper";
import Contacts from "@/src/widgets/contacts";
import DeliveryInfo from "@/src/widgets/deliveryInfo";
import DeliveryTable from "@/src/widgets/deliveryTable";
import Heading from "@/src/widgets/heading";
import OurValues from "@/src/widgets/ourValues";


export const AboutUs = () => {
    return (
        <div>
            <Heading/>
            <Wrapper>
            <OurValues/>
            <Contacts/>
            <DeliveryInfo/>
            <DeliveryTable/>
            </Wrapper>
        </div>
    );
};
