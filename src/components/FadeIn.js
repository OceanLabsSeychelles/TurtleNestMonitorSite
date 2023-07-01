import { motion } from "framer-motion";

export default function FadeIn(props) {
    const duration = props?.duration ? props.duration : 1;
    return (
        <motion.div
            className="box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeIn", duration: duration }}
        >
            {props.children}
        </motion.div>
    );
}
