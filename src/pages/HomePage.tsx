import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChefHat, Utensils, CookingPot, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ChefHat,
      title: 'Recettes personnalisées',
      description: 'Des suggestions adaptées à vos goûts et vos envies'
    },
    {
      icon: Utensils,
      title: 'Conseils culinaires',
      description: 'Des astuces de chef pour réussir tous vos plats'
    },
    {
      icon: CookingPot,
      title: 'Aide en cuisine',
      description: 'Un assistant toujours disponible pour vous guider'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
              <ChefHat className="w-24 h-24 text-primary mx-auto relative z-10" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Votre Assistant Culinaire
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discutez avec notre chef virtuel pour obtenir des recettes,
            des conseils et de l'inspiration culinaire !
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Commencer à discuter
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto border border-primary/20">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action Footer */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-muted-foreground/60 text-sm">
            Propulsé par Pain Web - Votre compagnon culinaire intelligent
          </p>
        </motion.div>
      </div>
    </div>
  );
}
